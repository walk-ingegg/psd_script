//init settings
IMG_EXTENSION = "*.psd";
ACTION_NAME = "vicc_trim";
SET_NAME = "vicc_trim";

var doc = app.activeDocument;
var docName = doc.name;
var docPath = doc.path;

var inPath = docName + "/" + docPath;
var backupPath = docPath + "/old_" + getTrimStr(docName, ".", 0);

/**
 メイン
 **/
if (BridgeTalk.appName == "photoshop") {
  main();
}

function main() {
  doc.save(); //ファイルを上書き保存
  makeDir(backupPath);

  try {
    // 開いたファイルにアクションを適用
    doAction(ACTION_NAME, SET_NAME);

    //.psdの前の部分を抽出
    inName = activeDocument.name;
    inName = getTrimStr(inName, ".", 0);

    // 分割されたファイルを保存する
    saveAsJPG(outPath + "/" + inName + ".jpg");

    doFinish();
  } catch (e) {
    alert("fail to make backup. please check problem");
  }

  doOpen(inPath);
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
function saveAsPSD(outPath) {
  var fileObj = new File(outPath);

  var psd_Opt = new PhotoshopSaveOptions();
  psd_Opt.layers = true; // Preserve layers.
  psd_Opt.embedColorProfile = true; // Preserve color profile.
  psd_Opt.annotations = true; // Preserve annonations.
  psd_Opt.alphaChannels = true; // Preserve alpha channels.
  psd_Opt.spotColors = true; // Preserve spot colors.

  doc.saveAs(fileObj, jpegOpt, true, Extension.LOWERCASE);
}

/**
   SPointでstrの文字列を分解して、SNumberのブロックを取り出す
**/
function getTrimStr(str, SPoint, SNumber) {
  var result = "";

  var SArray = str.split(SPoint);
  var result = SArray[SNumber];

  return result;
}

/**
   ファイルを閉じる
**/
function doFinish() {
  activeDocument.close(SaveOptions.DONOTSAVECHANGES);
}
// function getCurrentTime() {
//   let time;
//   const now = new Date();

//   const Year = now.getFullYear();
//   const Month = str(now.getMonth() + 1).padStart(2, "0");
//   const Day = str(now.getDate()).padStart(2, "0");
//   const Hour = str(now.getHours()).padStart(2, "0");
//   const Min = str(now.getMinutes()).padStart(2, "0");
//   const Sec = str(now.getSeconds()).padStart(2, "0");

//   return (time = "_" + Year + Month + Day + "_" + Hour + Min + Sec);
// }

/**
   pathのフォルダが無ければ作る
**/
function makeDir(path) {
  newFolder = new Folder(path);
  if (!path.exists) {
    newFolder.create();
  }
}
