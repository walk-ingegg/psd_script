/* Initial setup */
const myDoc = app.activeDocument;

const startLayerNumber = myDoc.artLayers.length;

var res = confirm('レイヤーの整理を開始します', false, 'YES/NO');
main(res);


function main(yesOrNo) {
    if (yesOrNo) {
        //16bitに変換
        setColorMode16Bit();

        //全レイヤーを非表示
        changeLayerVisible(false, 0)

        //レイヤー名を整理01
        try {
            getTrimedLayerName('.', '1')
        } catch (e) {
            //何もしない
        }

        //'default'を'FT_T-tree'に命名しなおす
        try {
            setDefaultToSky();
        } catch (e) {
            //何もしない
        }

        //レイヤー名を整理02
        try {
            getTrimedLayerName('_', '1')
        } catch (e) {
            //何もしない
        }

        //全レイヤーの配列を取得
        var artLayerArray = getArtLayerArray(0);

        //重複をのぞいた配列を取得して整頓
        removedDuplicateLayerList = removeArrayDuplicates(artLayerArray);
        removedDuplicateLayerList.sort();

        //重複をのぞいたリストからレイヤーセットを作成
        makeLayerset(removedDuplicateLayerList);

        //レイヤーセットに同じ名前のレイヤーを格納
        moveLayerToLayerSets();

        //レイヤーセットを結合
        joinLayerSets();


        // //結合後のレイヤーの配列を再び取得
        // var newArtLayerArray = getArtLayerArray(0);
        // //配列から頭文字のみを抽出
        // var capitalStrings = [];
        // for (i = 0; i < newArtLayerArray.length; i++) {
        //     capitalStrings.push(getTrimStr(newArtLayerArray[i], '-', 0))
        // }
        // //重複をのぞいた配列を取得して整頓
        // removedList = removeArrayDuplicates(capitalStrings);
        // removedList.sort();
        // //重複をのぞいたリストからレイヤーセットを作成
        // makeLayerset(removedList)
        // //レイヤーを移動
        // moveLayerToLayerSetsByCapital();

    }
}

var res2 = confirm('入れ替え用にしますか？', false, 'YES/NO');
if (res2) {
    var laySetObj = activeDocument.layerSets.add();
    laySetObj.name = 'forChange'; //レイヤーセット名を設定

    moveLayerSetsToLayerSets();
}


function setColorMode16Bit() {
    var idCnvM = charIDToTypeID("CnvM");
    var desc358 = new ActionDescriptor();
    var idDpth = charIDToTypeID("Dpth");
    desc358.putInteger(idDpth, 16);
    var idMrge = charIDToTypeID("Mrge");
    desc358.putBoolean(idMrge, false);
    executeAction(idCnvM, desc358, DialogModes.NO);
}

function setDefaultToSky() {
    activeDocument.activeLayer = myDoc.artLayers['default'];
    var layerObj = activeDocument.activeLayer; // アクティブレイヤー
    layerObj.name = 'FT_T-tree';
}

function joinLayerSets() {
    var layerSetsNumber = myDoc.layerSets.length;

    for (i = 0; i < layerSetsNumber; i++) {
        var selectLayerset = myDoc.layerSets[0];
        selectLayerset.merge();
    }
}

function moveLayerToLayerSets() {
    var layerNumber = myDoc.artLayers.length;

    for (i = 0; i < layerNumber; i++) {
        var selectLayer = myDoc.artLayers[0];
        var layerName = selectLayer.name;

        // レイヤーセット内に移動
        var layerObj = selectLayer;
        var relatveObj = activeDocument.layerSets[layerName];
        layerObj.move(relatveObj, ElementPlacement.PLACEATBEGINNING); // グループ内の最背面へ
    }
}

function moveLayerToLayerSetsByCapital() {
    var layerNumber = myDoc.artLayers.length;

    for (i = 0; i < layerNumber; i++) {
        var selectLayer = myDoc.artLayers[0];
        var layerName = selectLayer.name;

        var CStr = getTrimStr(layerName, '-', 0)
        var BStr = getTrimStr(layerName, '-', 1)


        activeDocument.activeLayer = selectLayer;
        var layerObj = activeDocument.activeLayer; // アクティブレイヤー
        // アクティブレイヤーに命名
        layerObj.name = BStr;
        // レイヤーセット内に移動
        var relatveObj = activeDocument.layerSets[CStr];
        layerObj.move(relatveObj, ElementPlacement.PLACEATBEGINNING); // グループ内の最背面へ
    }
}

function moveLayerSetsToLayerSets() {
    var layerNumber = myDoc.layerSets.length;

    for (i = 0; i < (layerNumber - 1); i++) {
        var selectLayer = myDoc.layerSets[1];


        // レイヤーセット内に移動
        var layerObj = selectLayer; // アクティブレイヤー
        var relatveObj = myDoc.layerSets['forChange'];
        //adding the dummy INSIDE the target LayerSet
        var dummieGroup = relatveObj.layerSets.add();
        dummieGroup.name = "dummy";

        layerObj.move(dummieGroup, ElementPlacement.PLACEBEFORE); // グループ内の最背面へ
        dummieGroup.remove();
    }
}


function makeLayerset(array) {
    for (i = 0; i < array.length; i++) {
        var LayerSetName = array[i]

        var laySetObj = activeDocument.layerSets.add();
        laySetObj.name = LayerSetName; //レイヤーセット名を設定
    }

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

function removeArrayDuplicates(array) {
    var exist = {},
        result = [];

    for (var i = 0, l = array.length; i < l; i++) {
        var tmp = array[i];

        if (!exist[tmp]) {
            exist[tmp] = true;
            result.push(tmp);
        }
    }

    return result;
}

function getTrimedLayerName(splitPoint, seletStringNumber) {
    for (i = 0; i < (startLayerNumber); i++) {
        var selectLayer = myDoc.artLayers[i];
        var layerName = selectLayer.name;

        dividedStrings = getTrimStr(layerName, splitPoint, seletStringNumber);

        // アクティブレイヤーに命名
        activeDocument.activeLayer = selectLayer;
        var layerObj = activeDocument.activeLayer;
        layerObj.name = dividedStrings;
    }
}

function getTrimStr(str, SPoint, SNumber) {
    var result = '';

    var SArray = str.split(SPoint);
    var result = SArray[SNumber];

    return result;
}

function changeLayerVisible(visibleBoolean, layerKind) {
    var currentLayerNumber = myDoc.artLayers.length;
    var currentLayerSetNumber = myDoc.layerSets.length;

    //artLayer == 0, layerSet == 1
    if (layerKind == 0) {
        layerKind = currentLayerNumber
    } else {
        layerKind = currentLayerSetNumber
    }

    for (i = 0; i < (layerKind); i++) {
        var selectLayer = myDoc.artLayers[i]
        activeDocument.activeLayer = selectLayer;

        var layerObj = activeDocument.activeLayer; // アクティブレイヤー
        layerObj.visible = visibleBoolean; // 非表示
    }
}
