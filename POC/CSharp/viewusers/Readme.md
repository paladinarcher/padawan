# viewusers

shows a list of users from the user database 

## Requirements 

[Mono](https://www.mono-project.com/docs/getting-started/install/)

Optionally [MonoDevelop](https://www.monodevelop.com/)   

## Mono Installs

### Mac

Installing mono for mac with homebrew: 

```
brew install mono
```

### Windows: 

[Stable Download](https://www.mono-project.com/download/stable/)

### Linux: 

Add the repo and install with your package manager. Instructions: 

[Distro Instructions Here](https://www.mono-project.com/download/stable/#download-lin)

## Instructions 

1. Clone the repo
2. Make sure the padawan project db is running.  The code is set to look for the db on `localhost:3001`
3. You could open and run it in MonoDevelop 
4. Alternatively, use `mono` to run the viewusers.exe located in  `<yourdirectory>/viewusers/viewusers/bin/Debug/`
5. You should be able to see the results in the browser at `localhost:3002/users`

### Example: 

```
mono <yourdirectory>/viewusers/viewusers/bin/Debug/viewusers.exe
``` 
