/**
   ユーザの変更値（ユーザ毎に変更が必要）
**/
IMG_EXTENSION = "*.psd";
ACTION_NAME = "vicc_trim_001";
SET_NAME = "vicc_trim";


/**
   下準備
**/
var doc= app.activeDocument;


if (BridgeTalk.appName == "photoshop") {
    main();
}

function main() {

    var inPath = doc.path+'/'+doc.name;

    var outPath = selectFolder("処理後のファイルを保存するフォルダを選択");

    for (i = 0; i < inPath.length; i++) {
        var inFileList = inPath[i].getFiles(IMG_EXTENSION);

        try {
            doOpen(inFileList)

            while (documents.length) {
                // 開いたファイルにアクションを適用
                doAction(ACTION_NAME, SET_NAME);

                //.psdの前の部分を抽出
                inName = activeDocument.name
                inName = getTrimStr(inName, ".", 0)

                // 分割されたファイルを保存する
                saveAsJPG(outPath + "/" + inName + ".jpg");

                doFinsh();
            }
        } catch (e) { }
    }
}


/**
   フォルダを選択
**/
function selectFolder(Comment) {
    var folderObj = Folder.selectDialog(Comment);
    return folderObj;
}


/**
   ファイルを開く
**/
function doOpen(fileName) {
    var fileRef = new File(fileName);
    open(fileRef);
    fileRef = null;
}


/**
   JPGで保存する
   @param   ファイル名
**/
function saveAsJPG(Name) {
    var fileObj = new File(Name);
    var jpegOpt = new JPEGSaveOptions();
    jpegOpt.embedColorProfile = true;
    jpegOpt.quality = 12;
    jpegOpt.formatOptions = FormatOptions.PROGRESSIVE;
    jpegOpt.scans = 3;
    jpegOpt.matte = MatteType.NONE;
    activeDocument.saveAs(fileObj, jpegOpt, true, Extension.LOWERCASE);
    fileObj = null;
    jpegOpt = null;
}


/**
   SPointでstrの文字列を分解して、SNumberのブロックを取り出す
**/
function getTrimStr(str, SPoint, SNumber) {
    var result = '';

    var SArray = str.split(SPoint);
    var result = SArray[SNumber];

    return result;
}


/**
   ファイルを閉じる
**/
function doFinsh() {
    activeDocument.close(SaveOptions.DONOTSAVECHANGES);
}


