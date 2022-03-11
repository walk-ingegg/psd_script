/**
   ユーザの変更値（ユーザ毎に変更が必要）
**/
// IMG_EXTENSION = "*.psd";
// ACTION_NAME = "vicc_trim_00";
// SET_NAME = "vicc_trim";


/**
   下準備
**/
var myDoc = app.activeDocument;


if (BridgeTalk.appName == "photoshop") {
    angleExportSel();
}


function angleExportSel() {
    myDoc.save(); //ファイルを上書き保存
    var inPath = myDoc.path + '/' + myDoc.name;
    var outPath = selectFolder("処理後のファイルを保存するフォルダを選択");
    var layList = getArtLayerArray(1);

    for (j = 1; j < layList.length; j++) {
        try {
            doOpen(inPath)

            // 開いたファイルにアクションを適用
            doAction("vicc_trim_00" + j, "vicc_trim");

            //.psdの前の部分を抽出
            inName = activeDocument.name
            inName = getTrimStr(inName, ".", 0)

            // 分割されたファイルを保存する
            saveAsJPG(outPath + "/" + inName + "_" + layList[j] + ".jpg");

            doFinsh();

        } catch (e) {
            break;
         }
    }
    doOpen(inPath)
}


function angleExportAll() {
    myDoc.save(); //ファイルを上書き保存
    var inPath = myDoc.path + '/' + myDoc.name;
    var outPath = selectFolder("処理後のファイルを保存するフォルダを選択");
    var layList = getArtLayerArray(1);

    for (j = 1; j < layList.length; j++) {
        try {
            doOpen(inPath)

            // 開いたファイルにアクションを適用
            doAction(ACTION_NAME + j, SET_NAME);

            //.psdの前の部分を抽出
            inName = activeDocument.name
            inName = getTrimStr(inName, ".", 0)

            // 分割されたファイルを保存する
            saveAsJPG(outPath + "/" + inName + "_" + layList[j] + ".jpg");

            doFinsh();

        } catch (e) {
            break;
         }
    }
    doOpen(inPath)
}


function saveFileOrNot() {
    var docObj = app.activeDocument; //アクティブなドキュメント
    var f = docObj.saved;
    if (f) {
        docObj.save();
    } else {
        alert("ドキュメントを保存してください")

        const flag = true;

        try {

            if (flag) {
                throw new Error('終了します');
            }
            console.log('実行されないコード');

        } catch (e) {

            console.log(e.message);

        }
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


//artLayer == 0, layerSet == 1
function getArtLayerArray(layerKind) {
    var result = []

    if (layerKind == 0) {
        var num = myDoc.artLayers.length

        for (i = 0; i < (num); i++) {
            var sel = myDoc.artLayers[i];
            var selName = sel.name;

            result.push(selName);
        }
    } else {
        var num = myDoc.layerSets.length

        for (i = 0; i < (num); i++) {
            var sel = myDoc.layerSets[i];
            var selName = sel.name;

            result.push(selName);
        }
    }

    return result;
}