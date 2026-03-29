## Post-Merge Cleanup

Run the standard post-merge cleanup sequence: switch to main, pull latest changes, and remove any local branches whose remote tracking branch has been deleted.

## Steps

Execute these commands in order. Stop and report if any step fails.

1. **Stash or warn about uncommitted changes**
   If `git status --porcelain` produces output, warn the user and ask before proceeding. Uncommitted work would be lost on branch switch.

2. **Switch to main and pull**
   ```bash
   git checkout main && git pull
   ```

3. **Fetch with prune to update remote tracking state**
   ```bash
   git fetch --prune
   ```

4. **List branches to check for [gone] status**
   ```bash
   git branch -v
   ```

5. **Delete [gone] branches**
   For each branch marked `[gone]`, check for an associated worktree first (`git worktree list`). Remove the worktree if one exists (but never remove the main worktree), then delete the branch with `git branch -D`.

   ```bash
   git branch -v | grep '\[gone\]' | sed 's/^[+* ]//' | awk '{print $1}' | while read branch; do
     worktree=$(git worktree list | grep "\\[$branch\\]" | awk '{print $1}')
     if [ -n "$worktree" ] && [ "$worktree" != "$(git rev-parse --show-toplevel)" ]; then
       echo "Removing worktree: $worktree"
       git worktree remove --force "$worktree"
     fi
     echo "Deleting branch: $branch"
     git branch -D "$branch"
   done
   ```

6. **Report results**
   Summarize: current branch, how many branches were cleaned up (and their names), and confirm the working tree is clean.
