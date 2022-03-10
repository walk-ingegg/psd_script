/**
   ユーザの変更値（ユーザ毎に変更が必要）
**/
IMG_EXTENSION = "*.psd";
ACTION_NAME = "vicc_trim_000";
SET_NAME = "vicc_trim";
eNum = "001"

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
   ファイルを閉じる
**/
function doFinsh() {
   activeDocument.close(SaveOptions.DONOTSAVECHANGES);
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
   SPointでstrの文字列を分解して、SNumberのブロックを取り出す
**/
function getTrimStr(str, SPoint, SNumber) {
   var result = '';

   var SArray = str.split(SPoint);
   var result = SArray[SNumber];

   return result;
}




/********** PhotoShop向け ***************/
if (BridgeTalk.appName == "photoshop") {
   main();
}



function main() {
   var inPath = selectFolder("処理したいファイルが存在するフォルダを選択");
   var outPath = selectFolder("処理後のファイルを保存するフォルダを選択");
   var inPath = inPath.getFiles();
   var fileList = inPath.getFiles(IMG_EXTENSION);
   var i;
   for (i = 0; i < fileList.length; i++) {
      // 元ファイルを保存する
      doOpen(inPath + "/" + fileList[i].name);

      while (documents.length) {
         // 開いたファイルにアクションを適用
         doAction(ACTION_NAME, SET_NAME);
         
         //.psdの前の部分を抽出
         inName = activeDocument.name
         inName = getTrimStr(inName, "." , 0)

         // 分割されたファイルを保存する
         saveAsJPG(outPath + "/" + inName + ".jpg");


         doFinsh();
      }
   }
}

