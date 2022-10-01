# Working with files in Magento

### Files inaccessible by users
Some files, generated or uploaded, need to be stored on the server for further processing or querying, but should not be directly accessible through a URL. Below are measures to avoid potential unauthorized access, path traversal, or RCE problems from such files
- Use random file names and extensions (it's better to use no file extensions); do not trust file names provided by users
- Store files in a directory specifically for generated/uploaded files
- Do not store these files in an HTTP accessible folder (like /pub)
- Store file records in a database if the files need to be assigned to an entity
- Do not trust user provided file names/IDs when deleting files; validate file ownership through the database

```
class MyClass {
    private \Magento\Framework\Filesystem $filesystem;

    private \Magento\Framework\Filesystem\Directory\WriteFactory $writeFactory;

    private \Magento\Framework\Math\Random $rand;

    public function __construct(
        \Magento\Framework\Filesystem $filesystem,
        \Magento\Framework\Filesystem\Directory\WriteFactory $writeFactory,
        \Magento\Framework\Math\Random $rand
    ) {
        $this->filesystem = $filesystem;
        $this->writeFactory = $writeFactory;
        $this->rand = $rand;
    }

    ...

    public function workWithFiles(): void {
        ...

        //To read "MAGENTO_ROOT/var" sub-directories or files.
        $varDir = $this->filesystem->getDirectoryRead(\Magento\Framework\App\Filesystem\DirectoryList::VAR_DIR);
        //Going to write files into a designated folder specific to these type of files and functionality
        //Getting WriteInterface instance of `MAGENTO_ROOT/var/my-modules-dir`
        $thisModulesFilesDir = $this->writeFactory->create($varDir->getAbsolutePath('my-modules-dir'));

        //Random file name
        $randomFileName = $this->rand->getRandomString(32);
        //Copying a file from the system temporary directory into it's new path
        $thisModulesFilesDir->getDriver()
            ->copy($tmpUploadedOrGeneratedFilePath, $thisModulesFilesDir->getAbsolutePath($randomFileName));
    }
}
```
### Files that require authorization
You should treat files that require authorization to download the same way as inaccessible files; with a controller that performs authorization and then serves the file by outputting its content in response body
### Publicly accessible media files
Publicly accessible media files present higher risk and require special care because you must keep the user-provided path and file extension. You should verify the following
- Media files can only be placed in a publicly accessible path
- Uploaded file path is inside the designated folder or its subdirectories
- Extension is safe (use an allow-list)
- File path is out of system folders that contain other application files
- Prevent deleting system files in public folders
- Ideally, verify user's relation to file (ownership), or containing directory before updating or deleting files
- The application uses the \Magento\Framework\App\Filesystem\DirectoryList::PUB directory for public files.
- Uploaded file paths must be validated using the ReadInterface and WriteInterface instances, similar to the preceding example.
- \Magento\Framework\Filesystem\Io\File can help extract file extensions from filenames.
```
class MyFileUploader {
    private const UPLOAD_DIR = 'my-module/customer-jpegs';

    private \Magento\Framework\Filesystem\Io\File $fileUtil;

    private array $allowedExt = ['jpg', 'jpeg'];

    private \Magento\Framework\Filesystem\Directory\WriteFactory $writeFactory;

    private \Magento\Framework\Filesystem $filesystem;

    /**
      * @param string $customerId UserContextInterface::getUserId() - current customer
      * @param array $uploadedFileData uploaded file data from $_FILES
      * @return MediaFile
      * @throws \Magento\Framework\Exception\ValidatorException
      */
    public function upload(string $customerId, array $uploadedFileData): MediaFile
    {
        //Get upload file's metadata
        $info = $this->fileUtil->getPathInfo($uploadedFileData['name']);
        //Validate extension is allowed
        if (!in_array($info['extension'], $this->allowedExt, true)) {
            throw new ValidationException('Only JPEG files allowed');
        }

        //Initiate WriteInterface instance of the target directory
        //Target dir is a sub-dir of PUB
        $uploadDir = $this->writeFactory->create(
            $this->filesystem->getDirectoryRead(\Magento\Framework\App\Filesystem\DirectoryList::PUB)
                ->getAbsolutePath(self::UPLOAD_DIR)
        );
        //Get target path if uploaded to the dir
        $realPath  =$uploadDir->getDriver()->getRealPathSafety($uploadDir->getAbsolutePath($uploadedFileData['name']));

        //Validate that the target file name is not a system file
        $this->validateNotSystemFile($realPath);
        //Validate that target folder (UPLOAD_DIR + ['name'] - ['basename']) is not a system folder
        $this->validateNotSystemFolder(preg_replace('/\/[^\/]+$/', '', $realPath));
        //Validate that given file doesn't exist or is own by current customer
        $existingMediaFileInfo = $this->findFileByRelativePath($realPath);
        if ($existingMediaFileInfo && $existingMediaFileInfo->getCustomerId() !== $customerId) {
            throw new ValidationException('Access denied');
        }

        //Copy temp file to target path
        $uploadDir->getDriver()->copy(
            $uploadedFileData['tmp_name'],
            $realPath
        );

        //Persist file info
        $mediaFile = new MediaFile($customerId, $realPath);
        return $this->persist($mediaFile);
    }
}
```

### Components
Get path to components
```
    Magento\Framework\Component\ComponentRegistrar
    /**#@+
     * Different types of components
     */
    const MODULE = 'module';
    const LIBRARY = 'library';
    const THEME = 'theme';
    const LANGUAGE = 'language';
    const SETUP = 'setup';
    
    Magento\Framework\Component\ComponentRegistrar::getPath()
    
    Get path to module:
    $this->componentRegistrar->getPath(ComponentRegistrar::MODULE, $moduleName)
```
## Upload

## Read files

### CSV
Magento\Framework\File\Csv
```
Get Data
Magento\Framework\File\Csv::getData()

Write Data
Magento\Framework\File\Csv::saveData()

Get Data Pair
Magento\Framework\File\Csv::getDataPair()
```
### Json
### Xml
### Excel






