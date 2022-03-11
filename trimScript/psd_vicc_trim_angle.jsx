/**
   下準備
**/
var myDoc = app.activeDocument;
var activeDocument_name = activeDocument.name;//アクティブになっているドキュメントの名前を取得	

myDoc.save(); //ファイルを上書き保存
var inPath = myDoc.path + '/' + myDoc.name;
var layList = getArtLayerArray(1);


var gUIWindow = new Window('dialog', 'vicc_trimScript');

gUIWindow.bounds = [200, 100, 580, 280];

gUIWindow.activeDocPnl = gUIWindow.add("panel", [10, 5, 370, 90], "アクティブドキュメント");
gUIWindow.activeDocPnl.editText = gUIWindow.activeDocPnl.add("edittext", [10, 15, 345, 33], activeDocument_name);
gUIWindow.activeDocPnl.editText.enabled = false

gUIWindow.activeDocPnl.radiorBtn1 = gUIWindow.activeDocPnl.add("radiobutton", [10, 40, 200, 58], "すべてのレイヤーを書き出し");
gUIWindow.activeDocPnl.radiorBtn2 = gUIWindow.activeDocPnl.add("radiobutton", [10, 55, 200, 75], "選択レイヤーを書き出し");

gUIWindow.activeDocPnl.radiorBtn1.value = true;

gUIWindow.dList = gUIWindow.add("dropdownlist", [15, 110, 365, 130], layList);
gUIWindow.dList.selection = 0;

gUIWindow.filterPnl = gUIWindow.add("panel", [10, 90, 370, 140], "フィルターの処理");

gUIWindow.okBtn = gUIWindow.add("button", [80, 145, 175, 170], "実行");
gUIWindow.cancelBtn = gUIWindow.add("button", [190, 145, 285, 170], "キャンセル");


gUIWindow.okBtn.onClick = function () {
    if (gUIWindow.activeDocPnl.radiorBtn2.value) {

        angleExportSel(gUIWindow.dList.selection);
    }
    else {
        angleExportAll();
    }

    gUIWindow.close();

}

gUIWindow.cancelBtn.onClick = function () {
    gUIWindow.close();
}


/**
   メイン
**/
if (BridgeTalk.appName == "photoshop") {
    gUIWindow.show();
}


/**
   関数↓
**/
function angleExportSel(layNum) {
    var outPath = selectFolder("処理後のファイルを保存するフォルダを選択");
    var layNum = layNum + 1;

    try {
        doOpen(inPath);

        // 開いたファイルにアクションを適用
        doAction("vicc_trim_00" + layNum, "vicc_trim");

        //.psdの前の部分を抽出
        inName = activeDocument.name;
        inName = getTrimStr(inName, ".", 0);

        // 分割されたファイルを保存する
        saveAsJPG(outPath + "/" + inName + "_" + layList[layNum - 1] + ".jpg");

        doFinsh();

    } catch (e) {
        
    }

    doOpen(inPath)
}


function angleExportAll() {
    var outPath = selectFolder("処理後のファイルを保存するフォルダを選択");

    for (j = 1; j <= layList.length; j++) {
        try {
            doOpen(inPath)

            // 開いたファイルにアクションを適用
            doAction("vicc_trim_00" + j, "vicc_trim");

            //.psdの前の部分を抽出
            inName = activeDocument.name
            inName = getTrimStr(inName, ".", 0)

            // 分割されたファイルを保存する
            saveAsJPG(outPath + "/" + inName + "_" + layList[j - 1] + ".jpg");

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