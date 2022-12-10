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

