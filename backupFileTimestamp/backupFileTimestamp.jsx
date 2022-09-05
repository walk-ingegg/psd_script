//init settings
var doc = app.activeDocument;
var docName = doc.name;
var docPath = doc.path;

var inPath = docName + "/" + docPath;
var inName = getTrimStr(docName, ".", 0);
var backupPath = docPath + "/old_" + inName;

/**
 メイン
 **/
if (BridgeTalk.appName == "photoshop") {
  main();
}

function main() {
  doc.save(); //ファイルを上書き保存
  makeDir(backupPath); //バックアップ用のフォルダ作成

  var timestamp = getTimeStamp();
  var out = backupPath + "/" + inName + "_" + timestamp + ".psd";

  alert(out);
  try {
    // ファイルを保存する
    saveAsPSD(out);
  } catch (e) {
    alert("fail to make backup. please check any problem");
  }
}

/**
   PSDで保存する
**/
function saveAsPSD(outPath) {
  var fileObj = new File(outPath);

  var psdOpt = new PhotoshopSaveOptions();
  psdOpt.layers = true; // Preserve layers.
  psdOpt.embedColorProfile = true; // Preserve color profile.
  psdOpt.annotations = true; // Preserve annotations.
  psdOpt.alphaChannels = true; // Preserve alpha channels.
  psdOpt.spotColors = true; // Preserve spot colors.

  doc.saveAs(fileObj, psdOpt, true);
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

function getTimeStamp() {
  var now = new Date();

  var yea = String(now.getFullYear());
  var mon = String(now.getMonth() + 1);
  var dat = String(now.getDate());
  var hou = String(now.getHours());
  var min = String(now.getMinutes());
  var sec = String(now.getSeconds());
  yea = yea.slice(-2);
  mon = ("00" + mon).slice(-2);
  dat = ("00" + dat).slice(-2);
  hou = ("00" + hou).slice(-2);
  min = ("00" + min).slice(-2);
  sec = ("00" + sec).slice(-2);

  var nowTime = yea + "-" + mon + "-" + dat + "_" + hou + "-" + min + "-" + sec;
  return nowTime;
}

/**
   pathのフォルダが無ければ作る
**/
function makeDir(path) {
  newFolder = new Folder(path);
  if (!path.exists) {
    newFolder.create();
  }
}
