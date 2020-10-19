package main

import (
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"path"
	"path/filepath"

	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
	"gopkg.in/yaml.v2"
)

var REDIRECTS_FILE = "redirects.yaml"
var REDIRECTS = make(map[string]string)

type statusRecorder struct {
	http.ResponseWriter
	status int
}

func (rec *statusRecorder) WriteHeader(code int) {
	rec.status = code
	rec.ResponseWriter.WriteHeader(code)
}

func LoadRedirects() map[string]string {
	filename, err := filepath.Abs(REDIRECTS_FILE)
	if err != nil {
		panic(err)
	}
	yamlFile, err := ioutil.ReadFile(filename)
	if err != nil {
		panic(err)
	}
	var redirects map[string]string
	err = yaml.Unmarshal(yamlFile, &redirects)
	if err != nil {
		panic(err)
	}
	return redirects
}

func HandleSubdomain(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	if subdomain, ok := REDIRECTS[vars["subdomain"]]; ok {
		http.Redirect(w, r, subdomain, http.StatusFound)
	} else {
		http.ServeFile(w, r, "resume/public/404.html")
	}
}

func FileServerWithCustom404(fs http.FileSystem) http.Handler {
	fsh := http.FileServer(fs)
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		_, err := fs.Open(path.Clean(r.URL.Path))
		if os.IsNotExist(err) {
			http.ServeFile(w, r, "resume/public/404.html")
			return
		}
		fsh.ServeHTTP(w, r)
	})
}

func Router() *mux.Router {
	r := mux.NewRouter()

	r.StrictSlash(true)

	r.NotFoundHandler = http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, "resume/public/404.html")
	})

	// Redirect subdomain requests either to a valid website or to the homepage if subdomain is unknown.
	r.Host("{subdomain}.frank-blechschmidt.com").HandlerFunc(HandleSubdomain).Methods("GET")

	// For local development
	r.Host("{subdomain}.localhost").HandlerFunc(HandleSubdomain).Methods("GET")

	// Resumé web page as static content compiled by Hugo
	// r.PathPrefix("/").Handler(http.FileServer(http.Dir("resume/public")))
	r.PathPrefix("/").Handler(FileServerWithCustom404(http.Dir("resume/public")))

	return r
}

func main() {
	// Load redirects from file into global cache
	REDIRECTS = LoadRedirects()

	// CombinedLoggingHandler logs requests to out in Apache Combined Log Format
	r := Router()
	http.Handle("/", handlers.CombinedLoggingHandler(os.Stderr, r))

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
		log.Printf("Defaulting to port %s", port)
	}
	if err := http.ListenAndServe(":"+port, nil); err != nil {
		panic(err)
	}
}
