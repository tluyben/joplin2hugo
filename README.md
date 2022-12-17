# Joplin -> Hugo 

This is a very simple convertor from Joplin exports to the Hugo static site generator. 

## How to use

- no deps, just a modern node

1. Delete the current directories _resources and the dir (for me it's called Root)
2. Make sure the structure and naming in Joplin is identical to the dirs/files under {HUGOROOT}/content
3. Export md from Joplin
4. node index.js ~/Projects/mysite/base/export/dir . inside your {HUGOROOT}
5. hugo (serve)


Don't forget step one; for some reason it doesn't overwrite when exporting. 

## Automation on Mac OS X

To automate the complete publishing pipeline I have for my simple blog (which I want to host myself on a VPS), 
I have two scripts. 

- First, you need to make sure you have Hammerspoon (http://hammerspoon.org) installed and set up (you'll thank me later if you didn't know this tool anyway)

- In the ~/.hammerspoon directory, open or create the file init.lua or create a spoon in ~/.hammerspoon/Spoons and add the following watcher: 

```
-- watch for directory change and if there is a change, run the script
watcher = hs.pathwatcher.new("~/Documents/Joplin/MyBlog", function(files)
    local output = hs.execute("~/publishfromjoplin", false)
    hs.notify.new({title="Published new stuff to your blog!", informativeText=output}):send()
    printf("%s", output)
end):start()
```

Where ~/Documents/Joplin/MyBlog is the location where you export your files to from Joplin and ~/publishfromjoplin is a script that get's run whenever that directory changes. We could do both in Lua, but my Lua is a bit rusty and I already had the script, so up to you: 


```
#!/bin/bash

export PATH=/Users/Me/.nvm/versions/node/v17.9.0/bin:/opt/homebrew/bin:/opt/homebrew/sbin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin # <-- might or might not be needed, see below

cd /Users/Me/Projects/Myblog # <-- location of the root of your Hugo project

node /Users/Me/Projects/joplin2hugo/index.js ~/Documents/Joplin/MyBlog . #  <-- change the locations here again; joplin2hugo is this github repository

hugo # generate 

git add content
git add public 
git add static

git commit -m content # you can change this
git push

ssh root@myblogvpsserver 'cd /var/www/MyBlog; git pull' # <-- change this to where your static blog is hosted

# cleanup; mandatory; overwrite doesn't work 
rm -fR ~/Documents/Joplin
rm -fR ~/Documents/_resources

```

Now you might need to manually call your environment (PATH) in the Bash file if it is not working properly, *even* if it is working fine when you dry test. I myself needed to add on top of the Bash file: 

```
export PATH=/Users/Me/.nvm/versions/node/v17.9.0/bin:/opt/homebrew/bin:/opt/homebrew/sbin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin
```

# License 

MIT 

Disclaimer: for localhost experimentation only, we accept no liability. 

Support my open source work by <a href="https://twitter.com/luyben">following me on twitter <img src="https://storage.googleapis.com/saasify-assets/twitter-logo.svg" alt="twitter" height="24px" align="center"></a>