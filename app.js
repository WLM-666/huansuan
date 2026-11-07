const groups = {
  length: { name: '长度', units: [['mm','毫米',.001],['cm','厘米',.01],['m','米',1],['km','千米',1000],['in','英寸',.0254],['ft','英尺',.3048],['mi','英里',1609.344]], quick: [['m','ft'],['cm','in'],['km','mi']] },
  weight: { name: '重量', units: [['mg','毫克',.001],['g','克',1],['kg','千克',1000],['oz','盎司',28.349523125],['lb','磅',453.59237],['st','英石',6350.29318]], quick: [['kg','lb'],['g','oz'],['lb','kg']] },
  temperature: { name: '温度', units: [['C','摄氏度'],['F','华氏度']], quick: [['C','F'],['F','C']] },
  area: { name: '面积', units: [['mm2','平方毫米',1e-6],['cm2','平方厘米',1e-4],['m2','平方米',1],['km2','平方千米',1e6],['ha','公顷',10000],['acre','英亩',4046.8564224],['ft2','平方英尺',.09290304],['in2','平方英寸',.00064516],['mi2','平方英里',2589988.110336]], quick: [['m2','ft2'],['ha','acre'],['km2','mi2']] },
  volume: { name: '体积', units: [['ml','毫升',.001],['l','升',1],['m3','立方米',1000],['tsp','美制茶匙',.00492892159375],['tbsp','美制汤匙',.01478676478125],['floz','美制液体盎司',.0295735295625],['cup','美制杯',.2365882365],['pt','美制品脱',.473176473],['qt','美制夸脱',.946352946],['gal','美制加仑',3.785411784],['igal','英制加仑',4.54609]], quick: [['l','gal'],['ml','floz'],['cup','ml']] },
  speed: { name: '速度', units: [['m/s','米/秒',1],['km/h','千米/小时',1/3.6],['mph','英里/小时',.44704],['ft/s','英尺/秒',.3048],['knot','节',.514444444444]], quick: [['km/h','mph'],['m/s','km/h'],['mph','km/h']] },
  pressure: { name: '压力', units: [['Pa','帕',1],['kPa','千帕',1000],['bar','巴',100000],['psi','磅/平方英寸',6894.757293168]], quick: [['psi','kPa'],['bar','psi'],['kPa','bar']] }
};
const $ = id => document.getElementById(id);
const categories = $('categories'), inputA = $('value-a'), inputB = $('value-b'), unitA = $('unit-a'), unitB = $('unit-b'), hint = $('hint');
let current = 'length', activeSide = 'a';
const defaults = { length: ['m','ft'], weight: ['kg','lb'], temperature: ['C','F'], area: ['m2','ft2'], volume: ['l','gal'], speed: ['km/h','mph'], pressure: ['kPa','psi'] };
function format(n) { if (!Number.isFinite(n)) return ''; if (Object.is(n,-0)) n=0; return Number(n.toPrecision(10)).toLocaleString('en-US',{useGrouping:false,maximumSignificantDigits:10}); }
function convert(value, from, to, key) {
  if(key==='temperature') { const c=from==='C'?value:(value-32)*5/9; return to==='C'?c:c*9/5+32; }
  const units=groups[key].units, a=units.find(x=>x[0]===from), b=units.find(x=>x[0]===to); return value*a[2]/b[2];
}
function renderCategories(){ categories.replaceChildren(); for(const [key,g] of Object.entries(groups)){const b=document.createElement('button');b.className='category-tab';b.type='button';b.role='tab';b.setAttribute('aria-selected',String(key===current));b.textContent=g.name;b.addEventListener('click',()=>{current=key;renderCategories();renderUnits();renderQuick();update(activeSide)});categories.append(b);} }
function renderUnits(){ for(const select of [unitA,unitB]){select.replaceChildren();for(const [code,name] of groups[current].units){const o=document.createElement('option');o.value=code;o.textContent=name;select.append(o);}}unitA.value=defaults[current][0];unitB.value=defaults[current][1]; }
function update(side){activeSide=side;const source=side==='a'?inputA:inputB,target=side==='a'?inputB:inputA,from=side==='a'?unitA.value:unitB.value,to=side==='a'?unitB.value:unitA.value; if(source.value.trim()===''){target.value='';hint.textContent='输入任意一侧，另一侧会即时更新';return;}const n=Number(source.value);target.value=Number.isFinite(n)?format(convert(n,from,to,current)):'';hint.textContent=`${source.value} ${groups[current].units.find(x=>x[0]===from)[1]} = ${target.value} ${groups[current].units.find(x=>x[0]===to)[1]}`;}
function renderQuick(){const list=$('quick-list');list.replaceChildren();for(const [from,to] of groups[current].quick){const unit=code=>groups[current].units.find(u=>u[0]===code);const card=document.createElement('div');card.className='quick-item';const title=document.createElement('strong');title.textContent=`${unit(from)[1]} → ${unit(to)[1]}`;const value=document.createElement('span');value.textContent=`1 ${unit(from)[1]} `;const arrow=document.createElement('em');arrow.textContent='≈';const result=document.createElement('span');result.textContent=`${format(convert(1,from,to,current))} ${unit(to)[1]}`;card.append(title,value,arrow,result);list.append(card);}}

const lexicon = [
  ['length','mm',['mm','millimeter','millimeters','millimetre','millimetres'],'毫米，米制长度单位的千分之一','常见于小零件、纸张和精密尺寸'],
  ['length','cm',['cm','centimeter','centimeters','centimetre','centimetres'],'厘米，米制长度单位的百分之一','常用于身高、衣物和商品尺寸'],
  ['length','m',['m','meter','meters','metre','metres'],'米，公制基本长度单位','常用于身高、房间和物体尺寸'],
  ['length','km',['km','kilometer','kilometers','kilometre','kilometres'],'千米，也称公里','常用于道路和地理距离'],
  ['length','in',['inches','inch','in','"'],'英寸，1 英寸等于 2.54 厘米','常用于屏幕、家具和商品尺寸'],
  ['length','ft',['feet','foot','ft'],'英尺，1 英尺等于 12 英寸','常用于美国身高、房间和建筑尺寸'],
  ['length','mi',['miles','mile','mi'],'英里，英制较长距离单位','常用于美国道路里程'],
  ['weight','mg',['mg','milligram','milligrams'],'毫克，克的千分之一','常用于药品和营养成分'],
  ['weight','g',['grams','gram','g'],'克，常用公制质量单位','常用于食品和小物件'],
  ['weight','kg',['kilograms','kilogram','kgs','kg'],'千克，1 千克等于 1000 克','常用于体重、行李和商品'],
  ['weight','oz',['ounces','ounce','oz'],'盎司；作重量时 1 oz 约等于 28.35 克','常用于食品和贵金属；若写 oz 但未说明液体或重量，请先确认'],
  ['weight','lb',['pounds','pound','lbs','lb'],'磅，1 磅约等于 0.454 千克','常用于美国体重、食品和包裹'],
  ['weight','st',['stones','stone','st'],'英石，1 英石等于 14 磅','常用于英国和爱尔兰的体重'],
  ['temperature','C',['celsius','centigrade','°c','degrees c','degree c','c'],'摄氏度，以水的冰点和沸点为 0° 与 100°','常用于大多数国家的天气、烹饪和体温'],
  ['temperature','F',['fahrenheit','°f','degrees f','degree f','f'],'华氏度，水的冰点为 32°、沸点为 212°','常用于美国天气、烹饪和体温'],
  ['area','mm2',['square millimeters','square millimeter','sq mm','mm2','mm²'],'平方毫米','常用于微小零件和截面尺寸'],
  ['area','cm2',['square centimeters','square centimeter','sq cm','cm2','cm²'],'平方厘米','常用于小物件和纸张面积'],
  ['area','m2',['square meters','square meter','square metres','square metre','sq m','m2','m²'],'平方米，边长一米正方形的面积','常用于房间、房屋和土地面积'],
  ['area','km2',['square kilometers','square kilometer','sq km','km2','km²'],'平方千米','常用于城市和地理区域面积'],
  ['area','ft2',['square feet','square foot','sq ft','ft2','ft²'],'平方英尺','常用于美国房屋和室内面积'],
  ['area','in2',['square inches','square inch','sq in','in2','in²'],'平方英寸','常用于小型商品和零件面积'],
  ['area','mi2',['square miles','square mile','sq mi','mi2','mi²'],'平方英里','常用于较大的土地和区域面积'],
  ['area','acre',['acres','acre'],'英亩，英制土地面积单位','常用于农场和较大地块'],
  ['area','ha',['hectares','hectare','ha'],'公顷，等于 10,000 平方米','常用于农地和林地面积'],
  ['volume','ml',['milliliters','milliliter','millilitres','millilitre','ml'],'毫升，升的千分之一','常用于饮料、药液和化妆品'],
  ['volume','l',['liters','liter','litres','litre','l'],'升，常用公制体积单位','常用于饮料、燃油和容器容量'],
  ['volume','m3',['cubic meters','cubic meter','cubic metres','cubic metre','m3','m³'],'立方米','常用于大型容器、建筑和水量'],
  ['volume','tsp',['teaspoons','teaspoon','tsp'],'美制茶匙，约 4.93 毫升','常用于美国食谱中的少量液体'],
  ['volume','tbsp',['tablespoons','tablespoon','tbsp'],'美制汤匙，约 14.79 毫升','常用于美国食谱'],
  ['volume','floz',['us fluid ounces','us fluid ounce','u.s. fluid ounces','u.s. fluid ounce','fluid ounces','fluid ounce','fl oz','fl. oz'],'美制液体盎司，约 29.57 毫升','常用于美国饮料和液体包装'],
  ['volume','cup',['cups','cup'],'美制杯，约 237 毫升','常用于美国食谱'],
  ['volume','pt',['pints','pint','pt'],'美制品脱，约 473 毫升','常用于饮料和食品包装'],
  ['volume','qt',['quarts','quart','qt'],'美制夸脱，约 946 毫升','常用于牛奶和液体容器'],
  ['volume','gal',['us gallons','us gallon','us gals','us gal','u.s. gallons','u.s. gallon','u.s. gal','american gallons','american gallon','american gal','gallons','gallon','gal'],'美制加仑，约 3.785 升','常用于美国燃油、牛奶和水'],
  ['volume','igal',['imperial gallons','imperial gallon','imperial gal','uk gallons','uk gallon','uk gal'],'英制加仑，约 4.546 升','常用于英国及部分英联邦地区的液体容量'],
  ['speed','m/s',['meters per second','meter per second','metres per second','metre per second','m/s'],'米每秒','常用于科学、风速和运动速度'],
  ['speed','ft/s',['feet per second','foot per second','ft/s'],'英尺每秒','常用于美国工程和运动速度'],
  ['speed','mph',['miles per hour','mile per hour','mph'],'英里每小时','常用于美国车速和道路限速'],
  ['speed','km/h',['kilometers per hour','kilometres per hour','km/h','kph'],'千米每小时','常见道路车速单位'],
  ['speed','knot',['knots','knot','kt'],'节，1 节等于每小时一海里','常用于航海和航空'],
  ['pressure','psi',['pounds per square inch','pound per square inch','psi'],'磅/平方英寸，英制压力单位','常用于轮胎、压缩空气和压力表'],
  ['pressure','bar',['bars','bar'],'巴，1 巴等于 100 千帕','常用于轮胎和工业压力'],
  ['pressure','kPa',['kilopascals','kilopascal','kpa'],'千帕，等于 1000 帕','常用于轮胎、天气和工程压力']
].map(([group,code,aliases,meaning,use])=>({group,code,aliases,meaning,use}));
function escRE(s){return s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');}
function parseNatural(text){
  const s=text.trim();if(!s)return {message:'请输入英文单位、数字或完整句子。'};
  if(/(?:^|\s)\d+\s*'\s*\d+(?!\s*(?:"|in\b))/i.test(s))return {message:'这个写法有歧义：你可能是在写英尺和英寸。请写成 5\'8"、5 ft 8 in，或补充说明。'};
  const found=[],compoundRanges=[];
  const compound=/(-?\d+(?:\.\d+)?)\s*(?:ft|feet|foot|')\s*(\d+(?:\.\d+)?)\s*(?:inches|inch|in|")/ig;
  for(const m of s.matchAll(compound)){compoundRanges.push([m.index,m.index+m[0].length]);found.push({group:'length',code:'ft',value:Number(m[1])+Number(m[2])/12,display:`${m[1]} 英尺 ${m[2]} 英寸`,span:m.index,meaning:'英尺和英寸组成的身高或长度',use:'常用于身高和商品尺寸'});}
  const aliases=[];for(const item of lexicon)for(const alias of item.aliases)aliases.push({item,alias});aliases.sort((a,b)=>b.alias.length-a.alias.length);
  for(const {item,alias} of aliases){
    const re=new RegExp(`(-?\\d+(?:\\.\\d+)?)\\s*(?:°\\s*)?${escRE(alias)}(?![a-z])`,'ig');
    for(const m of s.matchAll(re)){if(compoundRanges.some(([a,b])=>m.index>=a&&m.index+m[0].length<=b))continue;if(item.code==='oz'&&/\bfl\.?\s*$/i.test(s.slice(0,m.index+m[0].length)))continue;found.push({group:item.group,code:item.code,value:Number(m[1]),display:`${m[1]} ${alias}`,span:m.index,meaning:item.meaning,use:item.use,alias});}
  }
  const unique=[];for(const c of found.sort((a,b)=>a.span-b.span||b.display.length-a.display.length)){if(!unique.some(x=>x.span===c.span&&x.group===c.group&&x.code===c.code))unique.push(c);}
  if(unique.length){
    if(/\b-?\d+(?:\.\d+)?\s*(?:gal|gallon|gallons)\b/i.test(s)&&! /\b(?:us|u\.?s\.?|american|imperial|uk)\s*(?:gal|gallon|gallons)\b/i.test(s))return {message:'“gallon”可能是美制加仑（约 3.785 升）或英制加仑（约 4.546 升）。请注明 US gallon 或 imperial gallon。'};
    const ozOnly=/\b-?\d+(?:\.\d+)?\s*oz\b/i.test(s)&&! /\bfl\.?\s*oz\b/i.test(s);
    if(ozOnly&&!/\b(?:weight|weigh|weighs|weighed|mass|by weight|oz wt)\b/i.test(s))return {message:'“oz”既可表示重量盎司，也可能是液体盎司。请补充 “by weight” 或写成 “fl oz”，我再换算。'};
    return {candidates:unique};
  }
  const unknown=s.match(/(-?\d+(?:\.\d+)?)\s*([a-zA-Z][a-zA-Z0-9/.-]*)/);
  if(unknown)return {message:`识别到数值 ${unknown[1]} 和单位“${unknown[2]}”，但离线词库里没有这个单位。为避免猜错，请补充单位全称或告诉我它用于长度、重量、温度、面积、体积、速度还是压力。`};
  return {message:'没有找到明确的数字和单位。可以试试 “150 lbs” 或 “68°F”；如果单位写法不确定，请补充上下文。'};
}
function applyCandidate(c){current=c.group;renderCategories();renderUnits();renderQuick();unitA.value=c.code;unitB.value=c.code===defaults[c.group][0]?defaults[c.group][1]:defaults[c.group][0];inputA.value=format(c.value);inputB.value='';update('a');$('parse-status').textContent=`已识别：${c.display}。请核对下方换算结果。`;const info=$('unit-info');info.hidden=false;info.replaceChildren();const strong=document.createElement('strong');strong.textContent=`${groups[c.group].units.find(u=>u[0]===c.code)[1]} · ${c.meaning}`;const detail=document.createElement('span');detail.textContent=`常见用途：${c.use}`;info.append(strong,detail);document.querySelector('.converter').scrollIntoView({behavior:'smooth',block:'center'});}
function runParser(text){const status=$('parse-status'),list=$('candidates'),info=$('unit-info');list.replaceChildren();info.hidden=true;const result=parseNatural(text);if(result.message){status.textContent=result.message;return;}if(result.candidates.length===1){applyCandidate(result.candidates[0]);return;}status.textContent='句子里找到多个计量数据。请选择你想先换算的这一项：';for(const c of result.candidates){const b=document.createElement('button');b.type='button';b.className='candidate-button';b.textContent=`${c.display} · ${groups[c.group].name}（${groups[c.group].units.find(u=>u[0]===c.code)[1]}）`;b.addEventListener('click',()=>applyCandidate(c));list.append(b);}}
$('parse-text').addEventListener('click',()=>runParser($('natural-input').value));
$('natural-input').addEventListener('keydown',e=>{if((e.metaKey||e.ctrlKey)&&e.key==='Enter')runParser(e.currentTarget.value);});
const photoInput=$('photo-input'),photoArea=$('photo-area'),photoPreview=$('photo-preview');let photoUrl;
photoInput.addEventListener('change',async()=>{const file=photoInput.files&&photoInput.files[0];if(!file)return;if(photoUrl)URL.revokeObjectURL(photoUrl);photoUrl=URL.createObjectURL(file);photoPreview.src=photoUrl;photoArea.hidden=false;$('photo-status').textContent='照片已载入。正在检查此浏览器是否提供本机文字识别…';try{if(typeof TextDetector==='undefined'||!('createImageBitmap'in window))throw new Error('当前浏览器没有本机 OCR');const bitmap=await createImageBitmap(file);const lines=await new TextDetector().detect(bitmap);bitmap.close();const text=lines.map(line=>line.rawValue).join(' ');if(!text.trim())throw new Error('照片中未检测到文字');$('natural-input').value=text;$('photo-status').textContent='已从照片识别文字，请核对后点击“识别并换算”。';runParser(text);}catch{$('photo-status').textContent='此 iPhone 浏览器不提供网页内离线 OCR。可在“照片”中打开图片，长按用实况文本复制尺寸，再粘贴到上方识别框；照片只保留在本机。';}});
inputA.addEventListener('input',()=>update('a'));inputB.addEventListener('input',()=>update('b'));
for(const [select,side] of [[unitA,'a'],[unitB,'b']])select.addEventListener('change',()=>update(side));
$('swap').addEventListener('click',()=>{const u=unitA.value;unitA.value=unitB.value;unitB.value=u;const v=inputA.value;inputA.value=inputB.value;inputB.value=v;activeSide=activeSide==='a'?'b':'a';hint.textContent='已交换单位与数值';});
renderCategories();renderUnits();renderQuick();update('a');
if('serviceWorker' in navigator && location.protocol.startsWith('http')) window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));

