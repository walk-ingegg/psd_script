/* Initial setup */
const myDoc = app.activeDocument;

const layerSetsNumber = myDoc.layerSets.length;
const layerNumber = myDoc.artLayers.length;

for (i = layerNumber - 1; i >= 0; i--) {
  var selectLayer = myDoc.artLayers[i];
  var layerName = selectLayer.name;
  var targetLayerSets = myDoc.layerSets;

  if (existTargetLayerSets(i)) {
    //アクティブレイヤーからマスクを作る
    myDoc.activeLayer = selectLayer;
    selectMaskFromLayer();

    //マスクを入れ替える
    myDoc.activeLayer = myDoc.layerSets[layerName];
    deleteMask();
    makeMask();
  } else {
    //アクティブレイヤーからマスクを作る
    myDoc.activeLayer = selectLayer;
    selectMaskFromLayer();

    //レイヤーセットを追加して名前をつける
    var addLayerSet = myDoc.layerSets.add();
    addLayerSet.name = layerName;

    makeMask();

    addEffectLayer("BRIGHTNESSCONTRAST");
    deleteMask();
    addEffectLayer("COLORBALANCE");
    deleteMask();
  }
}

var res = confirm("元のレイヤーを削除しますか?", false, "YES/NO");
deleteSourceArtLayers(res);

function deleteSourceArtLayers(yesOrNo) {
  if (yesOrNo) {
    for (i = 0; i < layerNumber; i++) {
      var selectLayer = myDoc.artLayers[0];
      selectLayer.remove();
    }
  } else {
    var laySetObj = activeDocument.layerSets.add();
    laySetObj.name = "originalLayer"; //レイヤーセット名を設定
    moveLayerToLayerSets();
  }
}

function moveLayerToLayerSets() {
  var layerNumber = myDoc.artLayers.length;

  for (i = 0; i < layerNumber; i++) {
    var selectLayer = myDoc.artLayers[0];
    var layerName = selectLayer.name;

    // レイヤーセット内に移動
    var layerObj = selectLayer;
    var relatveObj = activeDocument.layerSets["originalLayer"];
    layerObj.move(relatveObj, ElementPlacement.PLACEATEND); // グループ内の最背面へ
  }
}

function existTargetLayerSets(layerCount) {
  var selectLayer = myDoc.artLayers[layerCount];
  var layerName = selectLayer.name;

  try {
    var targetLayerSets = myDoc.layerSets[layerName];
    return true;
  } catch (e) {
    return false;
  }
}

function selectMaskFromLayer() {
  var idsetd = charIDToTypeID("setd");
  var desc852 = new ActionDescriptor();
  var idnull = charIDToTypeID("null");
  var ref147 = new ActionReference();
  var idChnl = charIDToTypeID("Chnl");
  var idfsel = charIDToTypeID("fsel");
  ref147.putProperty(idChnl, idfsel);
  desc852.putReference(idnull, ref147);
  var idT = charIDToTypeID("T   ");
  var ref148 = new ActionReference();
  var idChnl = charIDToTypeID("Chnl");
  var idChnl = charIDToTypeID("Chnl");
  var idTrsp = charIDToTypeID("Trsp");
  ref148.putEnumerated(idChnl, idChnl, idTrsp);
  desc852.putReference(idT, ref148);
  executeAction(idsetd, desc852, DialogModes.NO);
}

function makeMask() {
  var idMk = charIDToTypeID("Mk  ");
  var desc470 = new ActionDescriptor();
  var idNw = charIDToTypeID("Nw  ");
  var idChnl = charIDToTypeID("Chnl");
  desc470.putClass(idNw, idChnl);
  var idAt = charIDToTypeID("At  ");
  var ref155 = new ActionReference();
  var idChnl = charIDToTypeID("Chnl");
  var idChnl = charIDToTypeID("Chnl");
  var idMsk = charIDToTypeID("Msk ");
  ref155.putEnumerated(idChnl, idChnl, idMsk);
  desc470.putReference(idAt, ref155);
  var idUsng = charIDToTypeID("Usng");
  var idUsrM = charIDToTypeID("UsrM");
  var idRvlS = charIDToTypeID("RvlS");
  desc470.putEnumerated(idUsng, idUsrM, idRvlS);
  executeAction(idMk, desc470, DialogModes.NO);
}

function deleteMask() {
  var idDlt = charIDToTypeID("Dlt ");
  var desc447 = new ActionDescriptor();
  var idnull = charIDToTypeID("null");
  var ref143 = new ActionReference();
  var idChnl = charIDToTypeID("Chnl");
  var idOrdn = charIDToTypeID("Ordn");
  var idTrgt = charIDToTypeID("Trgt");
  ref143.putEnumerated(idChnl, idOrdn, idTrgt);
  desc447.putReference(idnull, ref143);
  executeAction(idDlt, desc447, DialogModes.NO);
}

// 調整レイヤーの追加
function addEffectLayer(kind) {
  // カラールックアップはLayerKind定数が存在しないため、colorLookupで対応
  var efTypeID = {
    SOLIDFILL: 177,
    GRADIENTFILL: 179,
    PATTERNFILL: 178,
    BRIGHTNESSCONTRAST: 1114793795,
    LEVELS: 1282829427,
    CURVES: 1131574899,
    EXPOSURE: 1165521011,
    VIBRANCE: 181,
    HUESATURATION: 1213428850,
    COLORBALANCE: 1131180610,
    BLACKANDWHITE: 1113681495,
    PHOTOFILTER: 180,
    CHANNELMIXER: 1130917453,
    colorLookup: 182,
    INVERSION: 1231976050,
    POSTERIZE: 1349743730,
    THRESHOLD: 1416131187,
    GRADIENTMAP: 1197755760,
    SELECTIVECOLOR: 1399612227,
  };
  var desc_setting = new ActionDescriptor();
  var classID = charIDToTypeID("AdjL"); //デフォルト
  switch (kind) {
    case "SOLIDFILL":
      var desc = new ActionDescriptor();
      desc.putDouble(charIDToTypeID("Rd  "), 0.0);
      desc.putDouble(charIDToTypeID("Grn "), 0.0);
      desc.putDouble(charIDToTypeID("Bl  "), 0.0);
      var desc_setting = new ActionDescriptor();
      desc_setting.putObject(
        charIDToTypeID("Clr "),
        charIDToTypeID("RGBC"),
        desc
      );
      classID = stringIDToTypeID("contentLayer");
      break;
    case "GRADIENTFILL":
      var list_c = new ActionList();
      var setColor = function (Lctn) {
        var desc_colorBk = new ActionDescriptor();
        desc_colorBk.putDouble(charIDToTypeID("Rd  "), 0.0);
        desc_colorBk.putDouble(charIDToTypeID("Grn "), 0.0);
        desc_colorBk.putDouble(charIDToTypeID("Bl  "), 0.0);
        desc = new ActionDescriptor();
        desc.putObject(
          charIDToTypeID("Clr "),
          charIDToTypeID("RGBC"),
          desc_colorBk
        );
        desc.putEnumerated(
          charIDToTypeID("Type"),
          charIDToTypeID("Clry"),
          charIDToTypeID("UsrS")
        );
        desc.putInteger(charIDToTypeID("Lctn"), Lctn);
        desc.putInteger(charIDToTypeID("Mdpn"), 50);
        return desc;
      };
      list_c.putObject(charIDToTypeID("Clrt"), setColor(0));
      list_c.putObject(charIDToTypeID("Clrt"), setColor(4096));
      var list_t = new ActionList();
      var setTrns = function (Lctn, prc) {
        desc = new ActionDescriptor();
        desc.putUnitDouble(charIDToTypeID("Opct"), charIDToTypeID("#Prc"), prc);
        desc.putInteger(charIDToTypeID("Lctn"), Lctn);
        desc.putInteger(charIDToTypeID("Mdpn"), 50);
        return desc;
      };
      list_t.putObject(charIDToTypeID("TrnS"), setTrns(0, 100.0));
      list_t.putObject(charIDToTypeID("TrnS"), setTrns(4096, 0.0));
      var desc_grad = new ActionDescriptor();
      desc_grad.putEnumerated(
        charIDToTypeID("GrdF"),
        charIDToTypeID("GrdF"),
        charIDToTypeID("CstS")
      );
      desc_grad.putDouble(charIDToTypeID("Intr"), 4096.0);
      desc_grad.putList(charIDToTypeID("Clrs"), list_c);
      desc_grad.putList(charIDToTypeID("Trns"), list_t);
      var desc_setting = new ActionDescriptor();
      desc_setting.putUnitDouble(
        charIDToTypeID("Angl"),
        charIDToTypeID("#Ang"),
        90.0
      );
      desc_setting.putEnumerated(
        charIDToTypeID("Type"),
        charIDToTypeID("GrdT"),
        charIDToTypeID("Lnr ")
      );
      desc_setting.putObject(
        charIDToTypeID("Grad"),
        charIDToTypeID("Grdn"),
        desc_grad
      );
      classID = stringIDToTypeID("contentLayer");
      break;
    case "PATTERNFILL":
      var desc = new ActionDescriptor();
      desc.putString(
        charIDToTypeID("Nm  "),
        "$$$/Presets/Patterns/Patterns_pat/GrayGranite=Gray Granite"
      );
      desc.putString(
        charIDToTypeID("Idnt"),
        "a1356097-8d80-11e8-a99c-ad1ce1639d3e"
      );
      desc_setting = new ActionDescriptor();
      desc_setting.putObject(
        charIDToTypeID("Ptrn"),
        charIDToTypeID("Ptrn"),
        desc
      );
      classID = stringIDToTypeID("contentLayer");
      break;
    case "BRIGHTNESSCONTRAST":
      desc_setting.putBoolean(stringIDToTypeID("useLegacy"), false);
      break;
    case "VIBRANCE":
      // default設定ではない
      break;
    case "COLORBALANCE":
      var list1 = new ActionList();
      list1.putInteger(0);
      list1.putInteger(0);
      list1.putInteger(0);
      desc_setting.putList(charIDToTypeID("ShdL"), list1);
      var list2 = new ActionList();
      list2.putInteger(0);
      list2.putInteger(0);
      list2.putInteger(0);
      desc_setting.putList(charIDToTypeID("MdtL"), list2);
      var list3 = new ActionList();
      list3.putInteger(0);
      list3.putInteger(0);
      list3.putInteger(0);
      desc_setting.putList(charIDToTypeID("HghL"), list3);
      desc_setting.putBoolean(charIDToTypeID("PrsL"), true);
      break;
    case "PHOTOFILTER":
      var desc = new ActionDescriptor();
      desc.putDouble(charIDToTypeID("Lmnc"), 67.06);
      desc.putDouble(charIDToTypeID("A   "), 32.0);
      desc.putDouble(charIDToTypeID("B   "), 120.0);
      desc_setting.putObject(
        charIDToTypeID("Clr "),
        charIDToTypeID("LbCl"),
        desc
      );
      desc_setting.putInteger(charIDToTypeID("Dnst"), 25);
      desc_setting.putBoolean(charIDToTypeID("PrsL"), true);
      break;
    case "CHANNELMIXER":
      var descR = new ActionDescriptor();
      descR.putUnitDouble(
        charIDToTypeID("Rd  "),
        charIDToTypeID("#Prc"),
        100.0
      );
      desc_setting.putObject(
        charIDToTypeID("Rd  "),
        charIDToTypeID("ChMx"),
        descR
      );
      var descG = new ActionDescriptor();
      descG.putUnitDouble(
        charIDToTypeID("Grn "),
        charIDToTypeID("#Prc"),
        100.0
      );
      desc_setting.putObject(
        charIDToTypeID("Grn "),
        charIDToTypeID("ChMx"),
        descG
      );
      var descB = new ActionDescriptor();
      descB.putUnitDouble(
        charIDToTypeID("Bl  "),
        charIDToTypeID("#Prc"),
        100.0
      );
      desc_setting.putObject(
        charIDToTypeID("Bl  "),
        charIDToTypeID("ChMx"),
        descB
      );
      break;
    case "colorLookup":
      // default設定ではない
      break;
    case "INVERSION":
      // default設定ではない
      break;
    case "POSTERIZE":
      desc_setting.putInteger(charIDToTypeID("Lvls"), 4);
      break;
    default:
      desc_setting.putEnumerated(
        stringIDToTypeID("presetKind"),
        stringIDToTypeID("presetKindType"),
        stringIDToTypeID("presetKindDefault")
      );
      break;
  }
  var desc_type = new ActionDescriptor();
  desc_type.putObject(charIDToTypeID("Type"), efTypeID[kind], desc_setting);
  var actDesc = new ActionDescriptor();
  var actRef = new ActionReference();
  actRef.putClass(classID);
  actDesc.putReference(charIDToTypeID("null"), actRef);
  actDesc.putObject(charIDToTypeID("Usng"), classID, desc_type);
  executeAction(charIDToTypeID("Mk  "), actDesc, DialogModes.NO);
}
/*
'SOLIDFILL'  ベタ塗り
'GRADIENTFILL'  グラデーション
'PATTERNFILL'  パターン
'BRIGHTNESSCONTRAST'  明るさ・コントラスト
'LEVELS'  レベル補正
'CURVES'  トーンカーブ
'EXPOSURE'  露光量
'VIBRANCE'  自然な彩度
'HUESATURATION'  色相・彩度
'COLORBALANCE'  カラーバランス
'BLACKANDWHITE'  白黒
'PHOTOFILTER'  レンズフィルター
'CHANNELMIXER'  チャンネルミキサー
'colorLookup'  カラールックアップ
'INVERSION'  階調の反転
'POSTERIZE'  ポスタリゼーション
'THRESHOLD'  2階調化
'GRADIENTMAP'  グラデーションマップ
*/
