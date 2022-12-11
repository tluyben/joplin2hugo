const fs = require('fs');
const path = require('path');

// Get the file path and target directory from command-line arguments
const sourceDirectory = process.argv[2];
const targetDirectory = process.argv[3];

if (!sourceDirectory || !targetDirectory) {
  console.error('Usage: node rewrite.js <source directory> <target directory>');
  process.exit(1);
}


function createDirectory(dirPath) {
  // Check if the directory exists
  if (!fs.existsSync(dirPath)) {
    // Create the parent directory (if it doesn't exist)
    const parentDir = path.dirname(dirPath);
    createDirectory(parentDir);

    // Create the current directory
    fs.mkdirSync(dirPath);
  }
}



// get all markdown files 
async function scanDirectory(dir) {
  // Read the directory contents
  const files = fs.readdirSync(dir);

  let contents = []
  // Iterate over each file in the directory
  for (const file of files) {


    // Construct the absolute path to the file
    const filePath = path.join(dir, file);

    // If the file is a directory, recursively scan it for PHP files
    if (fs.statSync(filePath).isDirectory()) {
      contents = contents.concat(await scanDirectory(filePath));
    }

    if (!file.endsWith('.md')) continue;
    contents.push(filePath)

  }
  return contents
}


async function copyMarkdownImages(markdownFile, targetDirectory) {
  // Read the markdown file
  let markdown = fs.readFileSync(markdownFile, 'utf-8');

  // Find all image references in the markdown
  const imageRegex = /!\[[^\]]*\]\(([^\)]+)\)/ig;

  for (let s of markdown.split('\n')) {
    //console.log('Processing line: ' + s)
    let match;
    while ((match = imageRegex.exec(s)) !== null) {
      //console.log('Found image: ' + match);
      const [imageTag, imagePath] = match;
      const imageName = path.basename(imagePath);

      const newImageName = imageName.replace(/[^a-z0-9]/gi, '_');
      const imageDir = path.join(path.dirname(markdownFile), imagePath)

      // Copy the image file to the target directory
      fs.copyFileSync(imageDir, path.join(targetDirectory + '/static', newImageName));

      // Replace the image reference in the markdown
      const newImageTag = imageTag.replace(imagePath, `/${newImageName}`);
      markdown = markdown.replace(imageTag, newImageTag);
    }
  }

  // remove the base from the markdown file
  const newMarkdownFile = markdownFile.replace(sourceDirectory, '')

  const targetMarkdown = path.join(targetDirectory + '/content', newMarkdownFile)

  // Create the target directory (if it doesn't exist)
  createDirectory(path.dirname(targetMarkdown));

  // Write the updated markdown to the target directory
  fs.writeFileSync(targetMarkdown, markdown);
}

(async () => {
  const files = await scanDirectory(sourceDirectory)

  for (const file of files) {
    console.log('Processing file: ' + file)
    await copyMarkdownImages(file, targetDirectory);
  }


})()