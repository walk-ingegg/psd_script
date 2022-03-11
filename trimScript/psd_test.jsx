var myDoc = app.activeDocument;
inPath = myDoc.path + '/' + myDoc.name

// alert(inPath);
// saveFileOrNot();
myDoc.save();
main();


function main() {

    var layList = getArtLayerArray(1)
    alert(layList[1]);
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


// function saveFileOrNot() {
//     var docObj = app.activeDocument; //アクティブなドキュメント
//     var f = docObj.saved;
//     if (f) {
//         docObj.save();
//     } else {
//         alert("ドキュメントを保存してください")

//         const flag = true;

//         try {

//             if (flag) {
//                 throw ('終了します');
//             }
//             // console.log('実行されないコード');

//         } catch (e) {

//             // console.log(e.message);
//             alert("Error: " + e);
            
//         }
//     }
// }


/**
    レイヤー構造

    sample.psd
        ajustment
            調整レイヤー_001
            調整レイヤー_002
            ...
        layer_001
            001
                trim_001
                    trimUp_001
                    trimDown_001
                    trim
**/