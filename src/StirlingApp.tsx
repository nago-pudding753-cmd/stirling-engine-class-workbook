import { useEffect, useMemo, useState } from 'react';
import { Activity, ArrowDownToLine, ArrowRight, BookOpen, Check, CheckCircle2, ChevronDown, ChevronRight, CircleHelp, ClipboardList, Cog, Download, FileCheck2, FileText, GraduationCap, Hammer, Lightbulb, ListChecks, LockKeyhole, Ruler, ShieldCheck, Sparkles, Wrench } from 'lucide-react';

type Design = {
  team: string;
  concept: string;
  bore: string;
  stroke: string;
  pistonGap: string;
  capRadialGap: string;
  plateThickness: string;
  connectingHole: string;
  skirtAllowance: string;
  expansionDeadRatio: string;
  compressionDeadRatio: string;
  rodLength: string;
  flywheel: string;
  flywheelMaterial: string;
  rimThickness: string;
  bossDiameter: string;
  bossLength: string;
};

const initialDesign: Design = {
  team: 'A班',
  concept: '標準形状を基準に、熱側・冷却側のピストン位相差が始動性と出力にどう影響するかを測定して確かめる。',
  bore: '16',
  stroke: '10',
  pistonGap: '1.5',
  capRadialGap: '1.2',
  plateThickness: '8',
  connectingHole: '4',
  skirtAllowance: '2.5',
  expansionDeadRatio: '1.5',
  compressionDeadRatio: '0.5',
  rodLength: '35',
  flywheel: '70',
  flywheelMaterial: 'C3604BD',
  rimThickness: '8',
  bossDiameter: '20',
  bossLength: '6',
};

const sourceNote = '参考：添付「2026年度_プロダクションプラクティス_指導書本文」';
const lessons = [
  { title: '理論値計算・P–V線図', phase: '設計・計算', pages: '指導書 §2.1–2.2、添付資料4', goal: 'α形の動作原理を確認し、設計条件から性能の理論値とP–V線図を作成します。', tasks: ['設計コンセプトを班で決め、測定して確かめたい性能を言葉にする', 'Dp=16 mm、Sp=8–14 mm、Pmean=129 kPa、κ=1、α=90°を設計条件に設定する', '膨張・圧縮側の行程容積、回転数、圧力変動、図示仕事・出力を計算する'], deliverable: '設計コンセプト記録用紙と設計計算書を作成。第1週終了までに設計値を確定し、第2週前日17時までに提出。', icon: Lightbulb },
  { title: '設計・部品図・組立図', phase: '設計・製図', pages: '指導書 §3.1–3.4、添付資料5', goal: '計算書の確定値を部品寸法へ落とし込み、加工者が一義的に読める図面を準備します。', tasks: ['部品図 ITEM 1–13 と組立図を作成し、干渉と寸法連鎖を確認する', '第三角法・原則1:1・中心基準寸法・材質・製作数を図面に記載する', 'コンロッド輪郭は素材とワイヤカット条件を確認してCAD化する'], deliverable: '担当部品図・組立図。図面と寸法は教員確認を受け、変更があれば変更履歴を残す。', icon: Ruler },
  { title: '加工工程表・役割・準備', phase: '工程表', pages: '指導書 §1.3、§4–5、添付資料1・2・6・7', goal: '部品ごとの作業手順、分担、加工時間、材料と工具を製作開始前にそろえます。', tasks: ['部品ごとの工程表に機械・取付け・工具・切削条件・検査を記入する', '作業予定表に図面、加工、測定、組立、評価と担当者を割り当てる', '材料・工具使用リストを作り、在庫と発注納期を教員に確認する'], deliverable: '役割分担表、14週の作業予定表、部品加工工程表、材料・工具使用リスト。', icon: ClipboardList },
  { title: '製作① — 加工準備・基本部品', phase: '製作', pages: '指導書 §1.2、§4–5', goal: '承認済みの加工工程表に基づいて加工を始めます。', tasks: ['作業着・帽子・保護具を確認し、担当職員の指示で作業を開始する', '素材寸法・工具リスト・加工原点・取付けを加工前に照合する', '毎回の実習日報に作業、気づき、次週の注意点を記録する'], deliverable: '承認済み加工工程表に基づく加工記録・日報。加工条件は指導者の指示に従う。', icon: Wrench },
  { title: '製作② — 加工・機械見学', phase: '製作', pages: '日程表、第4–5週', goal: '機械見学で加工方法を確認し、班の進捗と作業予定を更新します。', tasks: ['旋盤・フライス盤・ワイヤカットの役割と安全事項を確認する', '部品ごとの加工実績時間と寸法を記録する', '遅れや設計上の問題を班内で共有し、職員へ相談する'], deliverable: '更新した作業予定表と日報。', icon: Cog },
  { title: '製作③ — 旋盤・フライス盤', phase: '製作', pages: '指導書 §4.3–4.4、添付資料6', goal: '加工工程表の順序・治具・保持方法に従い、旋盤とフライス盤で部品を加工します。', tasks: ['ピストン・シリンダー加工はピストンを先にし、加熱ピストンを先行する', 'シリンダーは外径と冷却フィンの加工後に内径加工を行う', '薄肉部・圧入・治具の注意を確認し、加工ごとに寸法測定する'], deliverable: '部品寸法測定記録表と加工実績。切削条件は本アプリで決めず、担当職員の指示に従う。', icon: Hammer },
  { title: '製作④ — ワイヤカット', phase: '製作', pages: '指導書 §3.3、日程表第7週', goal: 'コンロッド輪郭データと素材・フライス前加工を確認し、担当職員へ加工依頼します。', tasks: ['コンロッド外形のDXFを作り、重複線・断線・単位・尺度を検査する', '素材端面を加工し、穴・座ぐり・面取りを工程表どおりに準備する', '素材端から輪郭を8 mm以上離し、図面・加工品・CADデータをそろえる'], deliverable: 'コンロッドのワイヤ加工用DXF、フライス加工図面と加工品。DXFは教員確認後に使用。', icon: Activity },
  { title: '製作⑤ — 組立', phase: '組立', pages: '日程表第8週、添付資料5', goal: '部品図・組立図と部品寸法を照合し、α形機構を組み立てます。', tasks: ['部品・軸受・締結部品の品番と測定結果を確認する', 'クランク位相差90°、ピストンの動作範囲、干渉・固さを確認する', '設計図との差や変更点を設計変更書へ記録する'], deliverable: '組立・調整記録、設計変更があれば設計変更書と改訂図面。', icon: Cog },
  { title: '製作⑥ — 評価試験', phase: '評価', pages: '日程表第9週、添付資料9', goal: '担当職員立会いのもと、試験条件を記録して性能を測定します。', tasks: ['試験前点検と安全確認を行い、担当職員の指示を受ける', '経過時間ごとの電流・電圧・回転数を測定して記録する', '理論値と実測値を比較し、誤差や動作状態を記録する'], deliverable: '性能試験結果記録用紙。加熱運転は教員立会いで行う。', icon: Activity },
  { title: '製作⑦ — 結果整理・設計変更検討', phase: '評価', pages: '指導書 §2.2.11、日程表第10週', goal: '試験結果から性能向上につながる設計案を検討し、変更理由と影響を整理します。', tasks: ['性能試験と理論計算を照合して改善したい要素を特定する', '関連部品・寸法連鎖・工程への影響を洗い出す', '設計変更書に変更前後、理由、予測効果、確認方法を記入する'], deliverable: '設計変更書。第10週終了時までに担当職員へ提出。', icon: Ruler },
  { title: '製作⑧ — 改善・追加製作', phase: '製作・評価', pages: '日程表第11週', goal: '承認された設計変更のみ、改訂図面・工程表に従って製作します。', tasks: ['変更図面と工程表の承認・版を確認する', '追加部品を加工し、寸法と組立状態を再確認する', '作業時間・変更点・未解決の問題を記録する'], deliverable: '変更部品、改訂図面・工程表、部品寸法測定記録。', icon: Hammer },
  { title: '製作⑨ — 再組立・調整', phase: '組立・評価', pages: '日程表第12週', goal: '変更部品を組み込み、機構の動きと改善内容を確認します。', tasks: ['変更部品の寸法・はめあい・取付け方向を確認する', 'ピストンの全行程、位相、干渉、回転抵抗を確認する', '再評価に必要な測定項目と条件を整理する'], deliverable: '設計変更後の組立記録と再評価計画。', icon: Cog },
  { title: '製作⑩ — 最終評価・発表準備', phase: 'まとめ', pages: '日程表第13週', goal: '性能・設計・加工の記録を整理し、コンテストと報告会の説明をまとめます。', tasks: ['最終性能値と試験条件を整理し、班間比較に備える', '設計コンセプト・計算・加工・変更・評価を一続きにまとめる', 'プレゼンシートと個人考察の根拠データを確認する'], deliverable: 'プレゼンシート、レポート資料、設計〜評価の記録一式。', icon: BookOpen },
  { title: '性能コンテスト・報告会', phase: '提出・発表', pages: '日程表第14週、指導書 §8', goal: '性能試験結果を発表し、設計意図と実機結果を考察して提出資料を整えます。', tasks: ['性能試験結果と比較条件を説明する', '理論値との差、設計変更の効果、改善案をデータに基づいて考察する', '指定された班長・班員別のレポート資料を順序どおりに提出準備する'], deliverable: '指定レポート一式。考察は2ページ以上。提出方法・期限は授業案内を確認。', icon: GraduationCap },
];

const documents = [
  { name: '設計コンセプト記録用紙（添付3）', type: '設計', detail: '班の全体コンセプト・各要素の設計ポイント・性能予測', icon: Lightbulb },
  { name: '設計計算書・P–V線図（添付4）', type: '計算', detail: '設計条件・寸法・Schmidt理論・性能予測', icon: Ruler },
  { name: 'AutoCAD用組立概略図（DXF）', type: '図面', detail: 'mm単位のα形機構学習用CAD図（製作図ではありません）', icon: Cog },
  { name: '加工工程表（添付6）', type: '工程', detail: '部品別作業順序・機械・工具・測定欄', icon: ListChecks },
  { name: '材料・工具使用リスト（添付7）', type: '準備', detail: '準備材料・工具・使用数・職員確認欄', icon: Wrench },
  { name: '作業予定表・役割分担表（添付1・2）', type: '計画', detail: '担当者・14週ガントチャート・実績時間', icon: ClipboardList },
  { name: '部品寸法測定記録表（添付8）', type: '測定', detail: '部品の設計値・測定値・差の記録欄', icon: Ruler },
  { name: '性能試験結果記録用紙（添付9）', type: '評価', detail: '時間ごとの電流・電圧・回転数の記録欄', icon: Activity },
  { name: '設計変更書（添付10）', type: '変更', detail: '変更前後・理由・予測効果・職員確認', icon: FileText },
  { name: 'レポート提出チェック（指導書§8）', type: '提出', detail: '班長・班員別の提出物順序と不足確認', icon: GraduationCap },
];

function calculate(d: Design) {
  const bore = Number(d.bore);
  const stroke = Number(d.stroke);
  const radius = stroke / 2;
  const pistonGap = Number(d.pistonGap);
  const capRadialGap = Number(d.capRadialGap);
  const plateThickness = Number(d.plateThickness);
  const connectingHole = Number(d.connectingHole);
  const skirtAllowance = Number(d.skirtAllowance);
  const expansionDeadRatio = Number(d.expansionDeadRatio);
  const compressionDeadRatio = Number(d.compressionDeadRatio);
  const rodLength = Number(d.rodLength);
  const rimThickness = Number(d.rimThickness);
  const bossDiameter = Number(d.bossDiameter);
  const bossLength = Number(d.bossLength);
  const sweptVolume = (Math.PI * bore ** 2 * stroke) / 4;
  const compressionSweptVolume = sweptVolume;
  const expansionDeadVolume = expansionDeadRatio * sweptVolume;
  const capInsideDiameter = bore + 2 * capRadialGap;
  const compressionDeadVolume = Math.PI * bore ** 2 / 4 * pistonGap + Math.PI * connectingHole ** 2 / 4 * plateThickness / 2;
  const regeneratorVolume = compressionDeadRatio * compressionSweptVolume - compressionDeadVolume;
  const expansionLength = (4 * expansionDeadVolume / Math.PI - bore ** 2 * pistonGap) / (capInsideDiameter ** 2 - bore ** 2) - plateThickness;
  const regeneratorLength = 4 * regeneratorVolume / (Math.PI * connectingHole ** 2);
  const deadVolume = expansionDeadVolume + regeneratorVolume + compressionDeadVolume;
  const cylinderLength = Math.max(2 * bore, 3 * stroke);
  const hotPistonLength = expansionLength - pistonGap + plateThickness + cylinderLength + skirtAllowance;
  const coldPistonLength = cylinderLength - pistonGap + skirtAllowance;
  const startRpm = 0.6 / (2.5e-9 * sweptVolume * 129);
  const highRpm = 1.2 / (2.5e-9 * sweptVolume * 129);
  const density = d.flywheelMaterial === 'SUS303' ? 7850 : 8530;
  const rimRadiusM = Number(d.flywheel) / 2000;
  const bossRadiusM = bossDiameter / 2000;
  const rimVolumeM3 = Math.PI / 4 * Math.max(0, Number(d.flywheel) ** 2 - bossDiameter ** 2) * rimThickness / 1e9;
  const bossVolumeM3 = Math.PI / 4 * bossDiameter ** 2 * bossLength / 1e9;
  const rimMass = rimVolumeM3 * density;
  const bossMass = bossVolumeM3 * density;
  const rimInertia = 0.5 * rimMass * (rimRadiusM ** 2 + bossRadiusM ** 2);
  const bossInertia = 0.5 * bossMass * bossRadiusM ** 2;
  const selectedWheelInertia = rimInertia + bossInertia;
  const validationWarnings = [
    ...(stroke < 8 || stroke > 14 ? ['指導書のストローク範囲は8–14 mmです。'] : []),
    ...(pistonGap < 1 || pistonGap > 2 ? ['ピストン頭頂すき間 c は指導書の目安1–2 mmを確認してください。'] : []),
    ...(capRadialGap < 0.75 || capRadialGap > 2 ? ['加熱キャップ半径すき間は指導書の目安0.75–2 mmを確認してください。'] : []),
    ...(plateThickness < 6 || plateThickness > 10 ? ['連結板厚 t は指導書の目安6–10 mmを確認してください。'] : []),
    ...(connectingHole < 2.5 || connectingHole > 5 ? ['連結穴径 dk は指導書の目安2.5–5 mmを確認してください。'] : []),
    ...(expansionDeadRatio <= 0 ? ['膨張側無効容積比 χDE は正の値にしてください。'] : []),
    ...(compressionDeadRatio <= 0 ? ['圧縮側無効容積比 χDC は正の値にしてください。'] : []),
    ...(regeneratorVolume < 0 ? ['VRが負になりました。入力寸法の組み合わせを見直してください。'] : []),
    ...(expansionLength <= 0 || !Number.isFinite(expansionLength) ? ['Lhを計算できません。クリアランスや内径条件を見直してください。'] : []),
    ...(bossDiameter >= Number(d.flywheel) ? ['ボス径D2は素材外径D1より小さく設定してください。'] : []),
    ...(hotPistonLength > 100 ? ['加熱側ピストン長さが100 mmを超えました。指導書に従い担当職員へ確認してください。'] : []),
  ];

  const schmidt = (temperatureExpansion: number) => {
    const temperatureCompression = 323;
    const tau = temperatureCompression / temperatureExpansion;
    const kappa = 1;
    const alpha = Math.PI / 2;
    const x = deadVolume / sweptVolume;
    const s = tau + (4 * tau * x) / (1 + tau) + kappa;
    const b = Math.sqrt(tau ** 2 + 2 * tau * kappa * Math.cos(alpha) + kappa ** 2);
    const phi = Math.atan2(kappa * Math.sin(alpha), tau + kappa * Math.cos(alpha));
    const delta = b / s;
    const pressureAt = (theta: number) => 129 * Math.sqrt(1 - delta ** 2) / (1 - delta * Math.cos(theta - phi));
    const idealWork = 129_000 * (sweptVolume / 1e9) * Math.PI * delta * (1 - tau) * Math.sin(phi) / (1 + Math.sqrt(1 - delta ** 2));
    const rpm = temperatureExpansion === 1173 ? highRpm : startRpm;
    const indicatedPower = idealWork * rpm / 60;
    const shaftPower = 0.7 * indicatedPower;
    const deltaEnergy = 0.25 * idealWork;
    const omega = 2 * Math.PI * rpm / 60;
    const totalInertia = deltaEnergy / (omega ** 2 * (1 / 200));
    return { tau, x, s, b, phi, delta, pressureAt, idealWork, indicatedPower, shaftPower, totalInertia, pressureMax: 129 * Math.sqrt(1 - delta ** 2) / (1 - delta), pressureMin: 129 * Math.sqrt(1 - delta ** 2) / (1 + delta) };
  };
  const start = schmidt(673);
  const maximum = schmidt(1173);
  const pvPoints = Array.from({ length: 25 }, (_, i) => {
    const theta = (i * 15 * Math.PI) / 180;
    const expansion = sweptVolume / 2 * (1 - Math.cos(theta));
    const compression = compressionSweptVolume / 2 * (1 - Math.cos(theta - Math.PI / 2));
    return { theta: i * 15, volume: (expansion + deadVolume + compression) / 1000, pressure: maximum.pressureAt(theta) };
  });
  const area = Math.PI * bore ** 2 / 4;
  const torquePoints = pvPoints.map(({ theta, pressure }) => {
    const force = area * (pressure - 101.3) / 1000;
    const radians = theta * Math.PI / 180;
    return { theta, pressure, force, torque: force * radius * (Math.sin(radians) + Math.sin(radians - Math.PI / 2)) / 1000 };
  });
  return {
    bore, stroke, radius, pistonGap, capRadialGap, plateThickness, connectingHole, skirtAllowance, expansionDeadRatio, compressionDeadRatio, rodLength,
    sweptVolume, compressionSweptVolume, expansionDeadVolume, capInsideDiameter, compressionDeadVolume,
    regeneratorVolume, expansionLength, regeneratorLength, deadVolume, cylinderLength, hotPistonLength,
    coldPistonLength, startRpm, highRpm, start, maximum, pvPoints, torquePoints,
    wheelStockDiameter: Number(d.flywheel), rimThickness, bossDiameter, bossLength, density,
    rimMass, bossMass, rimInertia, bossInertia, selectedWheelInertia, validationWarnings,
  };
}

function LinkageDiagram({ stroke }: { stroke: number }) {
  return <svg className="linkage-svg" viewBox="0 0 560 290" role="img" aria-label="加熱側・冷却側の2本のピストンを位相差90度で配置したα形スターリングエンジンの概念図">
    <defs><pattern id="stirlingGrid" width="16" height="16" patternUnits="userSpaceOnUse"><path d="M16 0H0V16" fill="none" stroke="#eeece5" strokeWidth=".7"/></pattern></defs>
    <rect width="560" height="290" fill="#fbfaf7"/><rect width="560" height="290" fill="url(#stirlingGrid)"/>
    <path d="M92 74H157V178H92Z" fill="#f5e7d5" stroke="#8a7150" strokeWidth="2"/><path d="M103 85H146V119H103Z" fill="#f9efdf" stroke="#b69667" strokeWidth="1.3"/><path d="M105 122H144V137H105Z" fill="#c79b66" stroke="#8a7150" strokeWidth="1.5"/><path d="M125 137V195" stroke="#9a7453" strokeWidth="5"/>
    <path d="M322 74H387V178H322Z" fill="#e3ece7" stroke="#718476" strokeWidth="2"/><path d="M333 85H376V119H333Z" fill="#eff3ed" stroke="#94a397" strokeWidth="1.3"/><path d="M335 122H374V137H335Z" fill="#aebdaf" stroke="#718476" strokeWidth="1.5"/><path d="M355 137V195" stroke="#788e7b" strokeWidth="5"/>
    <circle cx="240" cy="207" r="53" fill="#f0e6d5" stroke="#9f896c" strokeWidth="2"/><circle cx="240" cy="207" r="8" fill="#fff" stroke="#5b6055" strokeWidth="2"/><circle cx="240" cy="182" r="6" fill="#b47d53" stroke="#765c45" strokeWidth="1.2"/><circle cx="265" cy="207" r="6" fill="#75876c" stroke="#4f6348" strokeWidth="1.2"/><path d="M240 207V182M240 207H265" stroke="#718467" strokeWidth="4"/><path d="M125 195L240 182M355 195L265 207" stroke="#9b704e" strokeWidth="5" strokeLinecap="round"/><circle cx="240" cy="182" r="2" fill="#fff"/><circle cx="265" cy="207" r="2" fill="#fff"/>
    <text x="81" y="45" className="diagram-label">膨張側 / 加熱ピストン</text><text x="316" y="45" className="diagram-label">圧縮側 / 冷却ピストン</text><text x="105" y="103" className="diagram-small">高温側</text><text x="338" y="103" className="diagram-small">低温側</text><text x="204" y="147" className="diagram-label">位相差 α = 90°</text><text x="187" y="275" className="diagram-small">行程 S = {stroke.toFixed(1)} mm　 /　クランク半径 r = {(stroke / 2).toFixed(1)} mm</text><text x="382" y="255" className="diagram-caption">ALPHA TYPE / SCHEMATIC</text>
  </svg>;
}

type CadValue = ReturnType<typeof calculate>;

function createDxf(design: Design, values: CadValue) {
  const out: string[] = [];
  const pair = (code: number, value: string | number) => { out.push(String(code), String(value)); };
  const line = (layer: string, x1: number, y1: number, x2: number, y2: number) => {
    pair(0, 'LINE'); pair(8, layer); pair(10, x1.toFixed(3)); pair(20, y1.toFixed(3)); pair(30, 0); pair(11, x2.toFixed(3)); pair(21, y2.toFixed(3)); pair(31, 0);
  };
  const circle = (layer: string, x: number, y: number, radius: number) => {
    pair(0, 'CIRCLE'); pair(8, layer); pair(10, x.toFixed(3)); pair(20, y.toFixed(3)); pair(30, 0); pair(40, radius.toFixed(3));
  };
  const text = (layer: string, x: number, y: number, height: number, value: string) => {
    pair(0, 'TEXT'); pair(8, layer); pair(10, x.toFixed(3)); pair(20, y.toFixed(3)); pair(30, 0); pair(40, height.toFixed(2)); pair(1, value);
  };
  const rectangle = (layer: string, x: number, y: number, width: number, height: number) => {
    line(layer, x, y, x + width, y); line(layer, x + width, y, x + width, y + height);
    line(layer, x + width, y + height, x, y + height); line(layer, x, y + height, x, y);
  };
  const dimension = (x1: number, y1: number, x2: number, y2: number, label: string) => {
    line('DIM', x1, y1, x2, y2); text('DIM', (x1 + x2) / 2 + 1, (y1 + y2) / 2 + 2, 2.5, label);
  };

  pair(0, 'SECTION'); pair(2, 'HEADER'); pair(9, '$ACADVER'); pair(1, 'AC1009');
  pair(9, '$INSBASE'); pair(10, 0); pair(20, 0); pair(30, 0);
  pair(9, '$LIMMIN'); pair(10, 0); pair(20, 0); pair(9, '$LIMMAX'); pair(10, 297); pair(20, 210);
  pair(0, 'ENDSEC'); pair(0, 'SECTION'); pair(2, 'TABLES');
  pair(0, 'TABLE'); pair(2, 'LTYPE'); pair(70, 1); pair(0, 'LTYPE'); pair(2, 'CONTINUOUS'); pair(70, 0); pair(3, 'Solid line'); pair(72, 65); pair(73, 0); pair(40, 0); pair(0, 'ENDTAB');
  const layers = [['0', 7], ['OUTLINE', 7], ['HOT', 1], ['COLD', 5], ['LINKAGE', 3], ['CENTER', 8], ['DIM', 2], ['NOTE', 7]] as const;
  pair(0, 'TABLE'); pair(2, 'LAYER'); pair(70, layers.length);
  for (const [name, color] of layers) { pair(0, 'LAYER'); pair(2, name); pair(70, 0); pair(62, color); pair(6, 'CONTINUOUS'); }
  pair(0, 'ENDTAB'); pair(0, 'ENDSEC'); pair(0, 'SECTION'); pair(2, 'ENTITIES');

  // A3 landscape title frame. Geometry is a study diagram, deliberately not a fabrication drawing.
  rectangle('OUTLINE', 5, 5, 287, 200);
  line('OUTLINE', 5, 184, 292, 184);
  text('NOTE', 12, 192, 4.2, 'ALPHA STIRLING ENGINE - CLASS DESIGN STUDY');
  text('NOTE', 12, 187, 2.5, `TEAM ${design.team.replace(/[^A-Za-z0-9_-]/g, 'TEAM')}   |   CONCEPT: ${design.concept.replace(/[^A-Za-z0-9 .,;:_-]/g, '').slice(0, 54)}`);
  text('NOTE', 12, 174, 3, 'KINEMATIC CONCEPT - NOT FOR MANUFACTURE - VERIFY AGAINST APPROVED COURSE DRAWINGS');

  // Diagram coordinates communicate the alpha arrangement; only labeled dimensions are design values.
  const cx = 148; const cy = 91; const r = Math.min(values.radius, 7);
  rectangle('HOT', 60, 87, values.cylinderLength, 16); rectangle('HOT', 82, 87, 5, 16);
  rectangle('COLD', 140, 115, 16, values.cylinderLength); rectangle('COLD', 140, 115, 16, 5);
  line('LINKAGE', 87, 95, cx + r, cy); line('LINKAGE', 148, 115, cx, cy + r);
  circle('OUTLINE', cx, cy, Math.max(12, values.wheelStockDiameter / 2));
  circle('CENTER', cx, cy, 1.5); circle('HOT', cx + r, cy, 2.2); circle('COLD', cx, cy + r, 2.2);
  line('CENTER', cx - 3, cy, cx + 3, cy); line('CENTER', cx, cy - 3, cx, cy + 3);
  dimension(cx, cy, cx + r, cy, `CRANK R ${values.radius.toFixed(2)} mm`);
  dimension(60, 81, 60 + values.cylinderLength, 81, `LCL MIN ${values.cylinderLength.toFixed(1)} mm*`);
  text('HOT', 40, 108, 2.8, 'EXPANSION / HOT PISTON');
  text('COLD', 164, 143, 2.5, 'COLD PISTON / COMPRESSION');
  text('LINKAGE', 111, 111, 2.5, 'ALPHA PHASE DIFFERENCE = 90 DEG');
  text('NOTE', 188, 157, 2.6, `PISTON Dp = ${values.bore.toFixed(2)} mm (COURSE CONDITION)`);
  text('NOTE', 188, 150, 2.6, `STROKE Sp = ${values.stroke.toFixed(2)} mm`);
  text('NOTE', 188, 143, 2.6, `SWEEP VSE = ${values.sweptVolume.toFixed(1)} mm^3`);
  text('NOTE', 188, 136, 2.6, `MEAN PRESSURE = 129 kPa`);
  text('NOTE', 188, 129, 2.6, `EXPANSION TEMP = 673 / 1173 K`);
  text('NOTE', 188, 122, 2.6, `FLYWHEEL STOCK D1 = ${values.wheelStockDiameter.toFixed(1)} mm`);
  text('NOTE', 188, 115, 2.3, `RIM B1 = ${values.rimThickness.toFixed(1)}; BOSS D2/B2 = ${values.bossDiameter}/${values.bossLength} mm`);
  text('NOTE', 188, 109, 2.3, '*LCL IS A TEXTBOOK DESIGN MINIMUM ONLY;');
  text('NOTE', 188, 103, 2.3, 'FINAL PART GEOMETRY IS NOT DEFINED HERE.');
  text('NOTE', 12, 18, 2.5, 'DXF R12 / MODEL UNITS: mm / THIRD ANGLE PART DRAWINGS AND TOLERANCES MUST BE PREPARED SEPARATELY.');
  text('NOTE', 12, 12, 2.5, 'REFERENCE: COURSE GUIDE SECTIONS 2-3; ALL DIMENSIONS AND DESIGN CHANGES REQUIRE INSTRUCTOR REVIEW.');
  pair(0, 'ENDSEC'); pair(0, 'EOF');
  return out.join('\r\n') + '\r\n';
}

function PvPlot({ points }: { points: { volume: number; pressure: number }[] }) {
  const minVolume = Math.min(...points.map((point) => point.volume));
  const maxVolume = Math.max(...points.map((point) => point.volume));
  const minPressure = Math.min(...points.map((point) => point.pressure));
  const maxPressure = Math.max(...points.map((point) => point.pressure));
  const x = (volume: number) => 40 + ((volume - minVolume) / Math.max(1e-9, maxVolume - minVolume)) * 525;
  const y = (pressure: number) => 165 - ((pressure - minPressure) / Math.max(1e-9, maxPressure - minPressure)) * 132;
  const path = points.map((point, index) => `${index ? 'L' : 'M'}${x(point.volume).toFixed(1)},${y(point.pressure).toFixed(1)}`).join(' ');
  return <svg className="pv-plot" viewBox="0 0 590 205" role="img" aria-label="指導書Schmidt理論に基づく圧力-容積線図の理論曲線">
    <rect width="590" height="205" rx="5" fill="#fbfaf7"/>
    {[0, 1, 2, 3, 4].map((index) => { const yy = 33 + index * 33; return <g key={index}><line x1="40" y1={yy} x2="565" y2={yy} stroke="#e9e7e0" strokeWidth="1"/><text x="33" y={yy + 3} textAnchor="end" className="plot-tick">{(maxPressure - (maxPressure - minPressure) * index / 4).toFixed(0)}</text></g>;})}
    <line x1="40" y1="33" x2="40" y2="165" stroke="#888b80"/><line x1="40" y1="165" x2="565" y2="165" stroke="#888b80"/><path d={path} fill="none" stroke="#718568" strokeWidth="2.5"/>
    <text x="46" y="20" className="plot-label">P (kPa)</text><text x="565" y="185" textAnchor="end" className="plot-label">V (cm³)</text><text x="40" y="179" className="plot-tick">{minVolume.toFixed(2)}</text><text x="565" y="179" textAnchor="end" className="plot-tick">{maxVolume.toFixed(2)}</text><text x="422" y="20" className="plot-label">SCHMIDT THEORY · 1173 K</text>
  </svg>;
}

function App() {
  const [savedWorkbook] = useState(() => {
    try { return JSON.parse(localStorage.getItem('stirling-class-project-v2') || '{}') as { design?: Design; completedWeeks?: number[]; lessonChecks?: Record<string, boolean> }; }
    catch { return {}; }
  });
  const [design, setDesign] = useState({ ...initialDesign, ...savedWorkbook.design });
  const [activeTab, setActiveTab] = useState('授業の順序');
  const [notice, setNotice] = useState('');
  const [selectedDocument, setSelectedDocument] = useState(documents[0].name);
  const [completedWeeks, setCompletedWeeks] = useState<number[]>(savedWorkbook.completedWeeks || []);
  const [lessonChecks, setLessonChecks] = useState<Record<string, boolean>>(savedWorkbook.lessonChecks || {});
  const [selectedWeek, setSelectedWeek] = useState(() => {
    const done = savedWorkbook.completedWeeks || [];
    let next = 1;
    while (done.includes(next) && next < lessons.length) next += 1;
    return next;
  });
  const values = useMemo(() => calculate(design), [design]);
  const update = (key: keyof Design, value: string) => setDesign((previous) => ({ ...previous, [key]: value }));

  useEffect(() => {
    try { localStorage.setItem('stirling-class-project-v2', JSON.stringify({ design, completedWeeks, lessonChecks })); }
    catch { /* The workbook remains usable if local storage is unavailable. */ }
  }, [design, completedWeeks, lessonChecks]);

  const firstIncompleteIndex = lessons.findIndex((_, index) => !completedWeeks.includes(index + 1));
  const firstIncompleteWeek = firstIncompleteIndex < 0 ? lessons.length : firstIncompleteIndex + 1;
  const lesson = lessons[selectedWeek - 1];
  const canCompleteLesson = lesson.tasks.every((_, index) => lessonChecks[`${selectedWeek}-${index}`]);
  const toggleLessonTask = (taskIndex: number) => {
    const key = `${selectedWeek}-${taskIndex}`;
    setLessonChecks((previous) => ({ ...previous, [key]: !previous[key] }));
  };
  const completeLesson = () => {
    if (!canCompleteLesson) return;
    setCompletedWeeks((previous) => previous.includes(selectedWeek) ? previous : [...previous, selectedWeek]);
    if (selectedWeek < lessons.length) setSelectedWeek(selectedWeek + 1);
    setNotice(`第${selectedWeek}週の確認を記録しました`);
  };

  const makeDocument = (name: string) => {
    const partNames = ['ベース', '支柱', 'シリンダ連結板', 'シリンダ', '加熱キャップ', '加熱ピストン', '冷却ピストン', 'ピストンエンド', '軸受ハウジング', 'フライホイル', 'フライスコンロッド', 'コンロッド', 'コンロッドスペーサ'];
    let formDetails: string[] = [];
    if (name.includes('寸法測定')) {
      formDetails = ['ITEM | 部品名 | 寸法項目 | 図面値 | 測定値 | 差 | 測定者・日付', ...partNames.map((part, index) => `${index + 1} | ${part} | __________________ | __________ | __________ | __________ | __________________`)];
    } else if (name.includes('性能試験')) {
      formDetails = ['試験日：__________  熱源・試験条件：____________________', '経過時間 | 電圧 (V) | 電流 (A) | 回転数 (rpm) | 備考', ...Array.from({ length: 12 }, (_, index) => `${index} min | __________ | __________ | __________ | __________________`), '試験担当職員確認：____________________'];
    } else if (name.includes('役割分担')) {
      formDetails = ['部品 | 製図担当 | 工程表担当 | 加工担当 | 完成日', ...partNames.map((part, index) => `${index + 1} ${part} | __________ | __________ | __________ | __________`), '第1–14週 | タスク | 担当者 | 予定時間 | 実績時間 | 備考', ...lessons.map((item, index) => `第${index + 1}週 | ${item.title} | __________ | __________ | __________ | __________`)];
    } else if (name.includes('設計変更')) {
      formDetails = ['変更提案日：__________  提案者：__________  職員確認：__________', '変更対象部品・図面番号：________________________________', '変更前の寸法・仕様：____________________________________', '変更後の寸法・仕様：____________________________________', '変更理由・性能向上の予測：______________________________', '関連部品・寸法連鎖・工程への影響：______________________', '承認・実施日・再評価結果：______________________________', '提出期限：遅くとも第10週の授業終了時（指導書§2.2.11）。'];
    } else if (name.includes('レポート提出')) {
      formDetails = ['班長：表紙 → 設計計算書（慣性モーメント、P–V線図、性能予測）→ 設計コンセプト → 設計変更書 → 性能試験結果 → プレゼンシート → 考察（2ページ以上）→ 感想 → 部品図・組立図 → 加工工程表 → 材料・工具使用リスト → 作業予定表 → 役割分担表 → 部品寸法測定記録表。', '班長以外：表紙 → 各自の考察（2ページ以上）→ 感想。班共通資料は省略可能。', '担当職員印が必要な資料、訂正後の図面・工程表、変更部品資料を確認。提出期限・方法は授業案内で確認。'];
    } else if (name.includes('材料・工具')) {
      formDetails = ['部品名 | 材料・材質 | 素材寸法 | 工具・治具 | 必要数 | 在庫確認 | 職員印', ...partNames.map((part) => `${part} | __________ | __________ | __________ | ____ | □ | __________`), '材料発注は納期に余裕をもつ（指導書では入荷まで約2週間の場合があると記載）。'];
    } else if (name.includes('加工工程表')) {
      formDetails = ['部品名：__________  材質・素材寸法：________________  作成者：__________', 'No. | 加工工程図・工程 | 作業方法・取付け・検査 | 使用工具・治具 | 切削条件 | 確認印', ...Array.from({ length: 8 }, (_, index) => `${index + 1} | __________________ | __________________________ | ______________ | 職員指示 | ______`), 'ピストンを先に加工し、加熱ピストンを先行する。シリンダ内径は冷却フィン加工後。加工条件と治具は指導書・職員指示を確認。'];
    }
    const body = [
      `【${name}】`, `授業：プロダクションプラクティス／${design.team}`, '',
      '■ 設計コンセプト', design.concept, '',
      '■ 指導書§2.2 共通設計条件・初期検討値',
      `ピストン径 d：${values.bore.toFixed(2)} mm`,
      `行程 Sp：${values.stroke.toFixed(2)} mm`,
      `クランク半径 r：${values.radius.toFixed(2)} mm`,
      `作動空間平均圧力：129 kPa、位相差：90°、行程容積比：1`,
      `班で設定した無効容積比 χDE / χDC：${values.expansionDeadRatio.toFixed(2)} / ${values.compressionDeadRatio.toFixed(2)}（初期目安1.5 / 0.5）`,
      `膨張側行程容積 VSE：${values.sweptVolume.toFixed(2)} mm³`,
      `圧縮側行程容積 VSC：${values.compressionSweptVolume.toFixed(2)} mm³`,
      `加熱キャップ内径目安 Dc：${values.capInsideDiameter.toFixed(2)} mm`,
      `膨張空間長さ目安 Lh：${values.expansionLength.toFixed(2)} mm`,
      `連結穴長さ目安 Lk：${values.regeneratorLength.toFixed(2)} mm`,
      `シリンダ長さ目安 Lcl：${values.cylinderLength.toFixed(2)} mm`,
      `加熱側ピストン長さ目安 Lpe：${values.hotPistonLength.toFixed(2)} mm`,
      `冷却側ピストン長さ目安 Lpc：${values.coldPistonLength.toFixed(2)} mm`,
      `経験式による回転数目安：673 K / 0.6 W → ${values.startRpm.toFixed(0)} rpm、1173 K / 1.2 W → ${values.highRpm.toFixed(0)} rpm`,
      `Schmidt理論・最高回転条件での軸出力目安：${values.maximum.shaftPower.toFixed(3)} W`,
      `はずみ車2個分の慣性モーメント目安：${values.maximum.totalInertia.toExponential(3)} kg·m²`,
      `選定案はずみ車1個分 Is（リム＋ボス近似）：${values.selectedWheelInertia.toExponential(3)} kg·m²`,
      ...(name.includes('計算書') ? ['', '■ P–V線図の計算点（θ°, V cm³, P kPa）', ...values.pvPoints.map((point) => `${point.theta}, ${point.volume.toFixed(4)}, ${point.pressure.toFixed(3)}`), '■ トルク計算点（θ°, P kPa, Fp N, Tq N·m）', ...values.torquePoints.map((point) => `${point.theta}, ${point.pressure.toFixed(3)}, ${point.force.toFixed(4)}, ${point.torque.toFixed(5)}`)] : []),
      `連接棒長さ（検討入力値）：${values.rodLength.toFixed(2)} mm`,
      `フライホイール素材候補：${design.flywheelMaterial} φ${design.flywheel} mm、B1=${design.rimThickness} mm、D2=${design.bossDiameter} mm、B2=${design.bossLength} mm（入力仮定）`,
      `密度を用いた選定案Is（リム＋ボス）：${values.selectedWheelInertia.toExponential(3)} kg·m² / 必要IE/2：${(values.maximum.totalInertia / 2).toExponential(3)} kg·m²`, '',
      `■ 第${selectedWeek}週の本文を確認した記録`,
      lesson.title,
      `該当箇所：${lesson.pages}`,
      `確認した課題：${lesson.tasks.map((task, index) => `${lessonChecks[`${selectedWeek}-${index}`] ? '[済]' : '[未]'} ${task}`).join(' / ')}`,
      `今週の提出・記録：${lesson.deliverable}`,
      `14週全体：${completedWeeks.length} / ${lessons.length} 週を確認済み`, '',
      '■ 安全・設計上の留意点',
      '・Dp=16 mm、Sp=8–14 mm等の指定条件を守り、決定寸法は担当職員の確認を受ける。',
      '・本アプリは設計計算の学習補助であり、加工寸法・公差・切削条件を承認しない。',
      '・部品図、加工工程表、材料・工具リストを加工前に教員へ確認する。加熱試験は教員立会いで行う。', '',
      ...(formDetails.length ? ['■ 添付資料の記入用欄', ...formDetails, ''] : []),
      `${sourceNote} §2.2、添付資料4。`,
      '※授業記録用の参考出力です。正式な提出様式、担当職員印、配布図面を置き換えません。',
    ].join('\n');
    const blob = new Blob([body], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${name}_${design.team}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    setNotice(`${name}をダウンロードしました`);
  };

  const downloadDxf = () => {
    const blob = new Blob([createDxf(design, values)], { type: 'application/dxf;charset=us-ascii' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Alpha_Stirling_${design.team.replace(/[^A-Za-z0-9_-]/g, 'team')}_study_R12.dxf`;
    link.click();
    URL.revokeObjectURL(url);
    setNotice('AutoCAD互換のDXF（mm単位）をダウンロードしました');
  };

  const field = (key: 'stroke' | 'pistonGap' | 'capRadialGap' | 'plateThickness' | 'connectingHole' | 'skirtAllowance' | 'expansionDeadRatio' | 'compressionDeadRatio' | 'rodLength' | 'rimThickness' | 'bossDiameter' | 'bossLength', label: string, unit: string, step = 'any', min = 0, max?: number) => (
    <label className="engine-field" key={key}><span>{label}<em className="setting-mark">班で設定</em></span><div className="engine-input-unit"><input type="number" min={min} max={max} step={step} value={design[key]} onChange={(event) => update(key, event.target.value)} /><small>{unit}</small></div></label>
  );

  return <div className="engine-app">
    <aside className="engine-sidebar">
      <a className="engine-brand" href="#overview"><span className="brand-wheel"><Cog size={20}/></span><span><strong>ねつと、うごき。</strong><small>STIRLING ENGINE LAB</small></span></a>
      <div className="side-kicker">授業ワークスペース</div>
      <div className="class-card"><div className="class-symbol"><GraduationCap size={17}/></div><span><strong>プロダクション<br/>プラクティス</strong><small>ものづくり実習</small></span><ChevronDown size={14}/></div>
      <div className="side-kicker section-kicker">制作ノート</div>
      <button className={`engine-nav ${activeTab === '授業の順序' ? 'chosen' : ''}`} onClick={() => setActiveTab('授業の順序')}><ListChecks size={16}/>授業の順序</button>
      <button className={`engine-nav ${activeTab === '概要' ? 'chosen' : ''}`} onClick={() => setActiveTab('概要')}><Activity size={16}/>プロジェクト概要</button>
      <button className={`engine-nav ${activeTab === '設計条件' ? 'chosen' : ''}`} onClick={() => setActiveTab('設計条件')}><Ruler size={16}/>設計・計算</button>
      <button className={`engine-nav ${activeTab === '概略図' ? 'chosen' : ''}`} onClick={() => setActiveTab('概略図')}><Cog size={16}/>AutoCAD図面</button>
      <button className={`engine-nav ${activeTab === '工程表' ? 'chosen' : ''}`} onClick={() => setActiveTab('工程表')}><ListChecks size={16}/>作業工程表</button>
      <button className={`engine-nav ${activeTab === '提出書類' ? 'chosen' : ''}`} onClick={() => setActiveTab('提出書類')}><FileCheck2 size={16}/>提出書類</button>
      <div className="engine-side-bottom"><div className="source-chip"><BookOpen size={15}/><span><strong>指導書準拠</strong><small>第1週〜第14週</small></span></div><div className="student-chip"><div className="student-avatar">{design.team.slice(0,1)}</div><span><strong>{design.team}</strong><small>設計・製作チーム</small></span></div></div>
    </aside>

    <main className="engine-main" id="overview">
      <header className="engine-topbar"><div className="crumb">ものづくり実習 <ChevronRight size={13}/> <span>スターリングエンジン製作</span></div><div className="topbar-right"><span className="draft-status"><i/>第{firstIncompleteWeek}週の学習中</span><span className="term-label">2026年度</span></div></header>
      <div className="engine-content">
        <div className="engine-hero"><div className="hero-copy"><div className="hero-eyebrow"><span/>LEARN BY MAKING <span className="hero-divider">/</span> MECHANICAL DESIGN</div><h1>熱から、動きをつくる。</h1><p>コンセプトから設計値を考え、部品加工・組立・実験まで。<br/>スターリングエンジンをつくる授業の制作ノート。</p><div className="hero-meta"><span><GraduationCap size={14}/>{design.team}</span><span><Wrench size={14}/>設計・製作実習</span><span className="in-progress"><i/>計画中</span></div></div><div className="hero-illustration"><div className="heat-glow"></div><div className="engine-illustration"><div className="heat-cap"></div><div className="engine-cylinder"><i/><b/></div><div className="engine-beam"></div><div className="engine-crank"></div><div className="engine-wheel"><i></i></div><div className="engine-base"></div></div><span className="illus-label label-hot">HEAT</span><span className="illus-label label-work">WORK</span><span className="illus-note">熱の出入りが、往復運動と回転運動に。</span></div></div>

        <div className="tab-row"><button className={activeTab === '授業の順序' ? 'active' : ''} onClick={() => setActiveTab('授業の順序')}>授業の順序</button><button className={activeTab === '概要' ? 'active' : ''} onClick={() => setActiveTab('概要')}>概要</button><button className={activeTab === '設計条件' ? 'active' : ''} onClick={() => setActiveTab('設計条件')}>設計・計算</button><button className={activeTab === '概略図' ? 'active' : ''} onClick={() => setActiveTab('概略図')}>AutoCAD DXF</button><button className={activeTab === '工程表' ? 'active' : ''} onClick={() => setActiveTab('工程表')}>作業工程表</button><button className={activeTab === '提出書類' ? 'active' : ''} onClick={() => setActiveTab('提出書類')}><FileCheck2 size={16}/>提出書類 <span>{documents.length}</span></button></div>
        {notice && <div className="engine-notice"><CheckCircle2 size={16}/>{notice}<button onClick={() => setNotice('')}>閉じる</button></div>}
        {activeTab === '設計条件' && values.validationWarnings.map((warning) => <div className="calculation-warning" key={warning}><CircleHelp size={14}/>{warning} 教員に確認してください。</div>)}

        {activeTab === '授業の順序' && <section className="work-card lesson-page"><div className="section-topline"><div><span className="section-number">COURSE GUIDE / WEEK 01–14</span><h2>指導書の順に、一週ずつ進める</h2><p>その週の指導書を読み、課題を一つずつ確認。終わったら記録を出力して次の週へ進みます。</p></div><span className="progress-count">{completedWeeks.length} / {lessons.length} 週</span></div><div className="lesson-progress"><span style={{ width: `${completedWeeks.length / lessons.length * 100}%` }}/></div><div className="lesson-layout"><nav className="week-list" aria-label="授業週"><div className="week-list-title">授業日程表 · 14週</div>{lessons.map((item, index) => { const week = index + 1; const Icon = item.icon; const locked = week > firstIncompleteWeek && !completedWeeks.includes(week); return <button key={item.title} className={`week-item ${selectedWeek === week ? 'selected' : ''} ${completedWeeks.includes(week) ? 'finished' : ''}`} disabled={locked} onClick={() => setSelectedWeek(week)}><span className="week-number">{String(week).padStart(2, '0')}</span><Icon size={14}/><span className="week-name">{item.title}</span>{completedWeeks.includes(week) ? <CheckCircle2 size={14}/> : locked ? <LockKeyhole size={13}/> : null}</button>;})}</nav><article className="lesson-detail"><div className="lesson-meta"><span>第 {selectedWeek} 週</span><i>/</i><span>{lesson.phase}</span><span className="source-pill">{lesson.pages}</span></div><h3>{lesson.title}</h3><p className="lesson-goal">{lesson.goal}</p><div className="lesson-reference lesson-reading"><BookOpen size={14}/><span><strong>最初に指導書を読む</strong><br/>{lesson.pages}の該当箇所を読み、本文の手順・図・添付様式と画面を照らし合わせてください。</span></div><div className="lesson-rule"/><div className="lesson-section-title"><ListChecks size={15}/>本文を確認しながら進める</div><div className="lesson-tasks">{lesson.tasks.map((task, index) => { const key = `${selectedWeek}-${index}`; return <label className={`lesson-task ${lessonChecks[key] ? 'checked' : ''}`} key={task}><input type="checkbox" checked={Boolean(lessonChecks[key])} onChange={() => toggleLessonTask(index)}/><span className="custom-check"><Check size={12}/></span><span>{task}</span></label>;})}</div><div className="deliverable-box"><div><FileCheck2 size={15}/><strong>今週の提出・記録</strong></div><p>{lesson.deliverable}</p><button className="inline-document" onClick={() => { setSelectedDocument(lesson.title.includes('計算') ? '設計計算書・P–V線図（添付4）' : lesson.title.includes('工程表') || lesson.title.includes('加工準備') ? '加工工程表（添付6）' : lesson.title.includes('ワイヤカット') || lesson.title.includes('部品図') ? 'AutoCAD用組立概略図（DXF）' : lesson.title.includes('評価試験') ? '性能試験結果記録用紙（添付9）' : lesson.title.includes('設計変更') ? '設計変更書（添付10）' : lesson.title.includes('寸法') || lesson.title.includes('旋盤') ? '部品寸法測定記録表（添付8）' : '作業予定表・役割分担表（添付1・2）'); setActiveTab('提出書類'); }}><FileText size={13}/>関連資料・記録用紙を開く <ArrowRight size={13}/></button></div><div className="lesson-reference"><BookOpen size={14}/><span>{sourceNote} {lesson.pages}</span></div><div className="lesson-actions"><span>{canCompleteLesson ? 'チェック完了。学習記録を保存して次の週へ進めます。' : '本文に沿って内容を確認し、各項目にチェックしてください。'}</span><button className="download-button" disabled={!canCompleteLesson || completedWeeks.includes(selectedWeek)} onClick={completeLesson}>{completedWeeks.includes(selectedWeek) ? <CheckCircle2 size={15}/> : <ArrowRight size={15}/>} {completedWeeks.includes(selectedWeek) ? 'この週は完了済み' : selectedWeek === lessons.length ? '最終週を完了' : '確認を記録して次へ'}</button></div></article></div></section>}

        {activeTab === '概要' && <>
          <section className="brief-card"><div className="section-topline"><div><span className="section-number">01 / CONCEPT</span><h2>このエンジンで、何を確かめる？</h2></div><button className="quiet-button" onClick={() => setActiveTab('設計条件')}>コンセプトを編集 <ArrowRight size={14}/></button></div><div className="brief-body"><div className="idea-icon"><Lightbulb size={20}/></div><p>「{design.concept}」</p></div><div className="brief-bottom"><span><Sparkles size={14}/>授業のねらい：設計値と実物の動きのつながりを考える</span><span>コンセプトは班で編集できます</span></div></section>
          <div className="overview-columns"><section className="numbers-card"><div className="section-topline"><div><span className="section-number">02 / TEXTBOOK CALCULATIONS</span><h2>設計条件と理論値</h2></div><button className="round-link" aria-label="設計・計算へ" onClick={() => setActiveTab('設計条件')}><ArrowRight size={16}/></button></div><div className="number-grid"><div className="number-tile"><span>行程容積 <i>VSE</i></span><strong>{values.sweptVolume.toFixed(0)}<small>mm³</small></strong><div>Dp = 16 mm / Sp = {values.stroke} mm</div></div><div className="number-tile accent-tile"><span>回転数目安 <i>N</i></span><strong>{values.highRpm.toFixed(0)}<small>rpm</small></strong><div>1173 K / 軸出力1.2 W</div></div><div className="number-tile"><span>はずみ車慣性 <i>IE</i></span><strong>{values.maximum.totalInertia.toExponential(1)}<small>kg·m²</small></strong><div>速度変動率 1/200</div></div></div><div className="formula-line"><span>計算式（指導書 §2.2）</span><code>VSE = πDp²Sp / 4</code><code>Lnet = 2.5×10⁻⁹ VSE Pmean N</code></div></section>
            <section className="review-card"><div className="review-icon"><ShieldCheck size={17}/></div><div><span className="section-number">CHECK BEFORE MACHINING</span><h2>加工に入る前に</h2></div><ul><li><Check size={13}/>部品同士の寸法・位置関係を確認</li><li><Check size={13}/>材料・工具の在庫と工程表を確認</li><li><Check size={13}/>図面・加工順序を教員に確認</li></ul><button className="text-link" onClick={() => setActiveTab('工程表')}>教材の加工順序を確認 <ArrowRight size={13}/></button></section></div>
          <section className="build-card"><div className="section-topline"><div><span className="section-number">02 / SCHMIDT THEORY</span><h2>第1週のP–V線図</h2><p>指導書§2.2.6の理論値。配布Excelの計算書と比較し、計算前提を確認してください。</p></div><button className="quiet-button" onClick={() => setActiveTab('設計条件')}>計算条件・表を見る <ArrowRight size={14}/></button></div><PvPlot points={values.pvPoints}/><div className="formula-line"><span>1173 KのSchmidt理論</span><code>Pmean = 129 kPa</code><code>α = 90°</code><span>性能の保証値ではありません</span></div></section>
          <section className="build-card"><div className="section-topline"><div><span className="section-number">03 / ALPHA TYPE</span><h2>位相差90°の2ピストン機構</h2><p>指導書のα形機関に合わせた学習用概略図です。製作用図面ではありません。</p></div><button className="quiet-button" onClick={() => setActiveTab('概略図')}>AutoCAD DXFを出力 <ArrowRight size={14}/></button></div><div className="mini-diagram"><LinkageDiagram stroke={values.stroke}/></div><div className="parts-strip"><span><i className="part-dot dot-sage"/>圧縮側・冷却ピストン</span><span><i className="part-dot dot-copper"/>膨張側・加熱ピストン</span><span><i className="part-dot dot-brass"/>共通クランク軸</span><span className="diagram-warning"><CircleHelp size={13}/>寸法は配布図面を優先</span></div></section>
          <div className="source-note"><BookOpen size={14}/><span>{sourceNote} 材料在庫は班・年度で教員に確認してください。</span></div>
        </>}

        {activeTab === '設計条件' && <section className="work-card"><div className="section-topline"><div><span className="section-number">GUIDE §2.2 / DESIGN CALCULATION</span><h2>共通条件を確認し、班の設計値を決める</h2><p>添付資料4の順に計算します。灰色は指導書の固定条件、緑の「班で設定」欄が変更できる値です。</p></div><button className="quiet-button" onClick={() => makeDocument('α形スターリングエンジン設計計算書')}><Download size={14}/>計算書を保存</button></div><label className="engine-field concept-field"><span>設計コンセプト（添付資料3）</span><textarea value={design.concept} onChange={(event) => update('concept', event.target.value)} /></label><div className="condition-legend"><span className="legend-fixed"><LockKeyhole size={13}/> 共通条件 <strong>変更しない</strong></span><span className="legend-editable"><Ruler size={13}/> 班で設定 <strong>入力できます</strong></span><small>共通条件は指導書指定です。入力値は下の計算結果に反映されます。</small></div><div className="parameter-heading"><span>1. 指導書の共通条件</span>
        <small>固定条件（一部の経験値は初期検討用）</small></div><div className="parameter-grid common-grid"><label className="engine-field">
        <span>ピストン径 Dp <em className="locked-mark"><LockKeyhole size={11}/> 共通・変更不可</em></span>
        <div className="engine-input-unit"><input value="16" readOnly/><small>mm</small></div></label>{field('stroke', 'ストローク Sp（8–14）', 'mm', '1', 8, 14)}<label className="engine-field"><span>作動空間平均圧力 Pmean</span>
        <span>作動空間平均圧力 Pmean <em className="locked-mark"><LockKeyhole size={11}/> 共通・変更不可</em></span>
        <div className="engine-input-unit"><input value="129" readOnly/><small>kPa</small></div></label><label className="engine-field"><span>温度 TE / TC</span>
        <span>温度 TE / TC <em className="locked-mark"><LockKeyhole size={11}/> 共通・変更不可</em></span>
        <div className="engine-input-unit"><input value="673 / 323" readOnly/><small>K</small></div></label><label className="engine-field"><span>行程容積比 κ / 位相角 α</span>
        <span>行程容積比 κ / 位相角 α <em className="locked-mark"><LockKeyhole size={11}/> 共通・変更不可</em></span>
        <div className="engine-input-unit"><input value="1 / 90" readOnly/><small>— / deg</small></div></label>{field('expansionDeadRatio', '膨張側無効容積比 χDE（初期目安1.5）', '倍', '0.1', 0.1)}{field('compressionDeadRatio', '圧縮側無効容積比 χDC（初期目安0.5）', '倍', '0.1', 0.1)}<label className="engine-field">
        <span>熱側最高温度（性能検討） <em className="locked-mark"><LockKeyhole size={11}/> 共通・変更不可</em></span>
        <div className="engine-input-unit"><input value="1173" readOnly/><small>K</small></div></label></div><div className="parameter-heading"><span>2. 作動空間の幾何条件</span><small>指導書§2.2.5の範囲を表示</small></div><div className="parameter-grid">{field('pistonGap', 'ピストン頭頂すき間 c (1–2)', 'mm', '0.1', 1, 2)}{field('capRadialGap', '加熱キャップ半径すき間 (0.75–2)', 'mm', '0.05', 0.75, 2)}{field('plateThickness', '連結板厚 t (6–10)', 'mm', '1', 6, 10)}{field('connectingHole', '連結穴径 dk (2.5–5)', 'mm', '0.1', 2.5, 5)}{field('skirtAllowance', 'ピストンスカート余裕 cs (2–3)', 'mm', '0.1', 2, 3)}{field('rodLength', 'コンロッド長さ（要検討）', 'mm', '0.1', 1)}</div><div className="calc-result-heading"><span>3. 添付資料4の計算結果</span><small>入力に連動して計算</small></div><div className="calc-table"><div><span>膨張側行程容積 VSE = πDp²Sp/4</span><strong>{values.sweptVolume.toFixed(1)} mm³</strong></div><div><span>圧縮側行程容積 VSC（κ=1）</span><strong>{values.compressionSweptVolume.toFixed(1)} mm³</strong></div><div><span>膨張側無効容積 VDE（χDEを使用）</span><strong>{values.expansionDeadVolume.toFixed(1)} mm³</strong></div><div><span>圧縮側無効容積 VDC</span><strong>{values.compressionDeadVolume.toFixed(1)} mm³</strong></div><div><span>再生器容積 VR</span><strong>{values.regeneratorVolume.toFixed(1)} mm³</strong></div><div><span>加熱キャップ内径 Dc / 深さ Lh</span><strong>{values.capInsideDiameter.toFixed(2)} / {values.expansionLength.toFixed(2)} mm</strong></div><div><span>連結穴長さ Lk（幾何値）</span><strong>{values.regeneratorLength.toFixed(2)} mm</strong></div><div><span>シリンダ長さ Lcl ≥ max(2Dp, 3Sp)</span><strong>{values.cylinderLength.toFixed(1)} mm</strong></div><div><span>膨張側 / 圧縮側ピストン長さ</span><strong>{values.hotPistonLength.toFixed(1)} / {values.coldPistonLength.toFixed(1)} mm</strong></div></div><div className="parameter-heading"><span>4. 回転数・Schmidt理論による性能予測</span><small>簡易理論値。実測性能の保証値ではありません</small></div><div className="calc-table"><div><span>経験式 N（673 K・0.6 W）</span><strong>{values.startRpm.toFixed(0)} rpm</strong></div><div><span>経験式 N（1173 K・1.2 W）</span><strong>{values.highRpm.toFixed(0)} rpm</strong></div><div><span>Schmidt圧力変動（1173 K）</span><strong>{values.maximum.pressureMin.toFixed(1)}–{values.maximum.pressureMax.toFixed(1)} kPa</strong></div><div><span>図示仕事 Wi / 軸出力 ηm=0.7</span><strong>{values.maximum.idealWork.toExponential(2)} J / {values.maximum.shaftPower.toFixed(3)} W</strong></div><div><span>慣性モーメント IE（速度変動率1/200）</span><strong>{values.maximum.totalInertia.toExponential(2)} kg·m²</strong></div><div><span>始動条件（673 K）予測軸出力</span><strong>{values.start.shaftPower.toFixed(3)} W</strong></div></div><p className="iteration-note">指導書の手順：Schmidt理論の軸出力が経験式に仮定した0.6 / 1.2 Wと異なる場合、求めた軸出力を式(2.2.4.1)へ戻して再計算します。表示値は反復前の学習用初期計算です。</p>
        <div className="safety-callout"><CircleHelp size={17}/><span><strong>出力図は概念図です。製作用CAD図面ではありません。</strong><br/>添付指導書の部品図は第三角法・原則1:1・材質・製作数等が必要です。このDXFは機構説明用で、全体形状・配置・はめあい・公差を定義しません。工作機械やワイヤカットへ直接使用せず、部品図・組立図は指導書§3と配布図面をもとに別途作成して、教員確認を受けてください。</span></div><div className="source-note"><BookOpen size={14}/><span>{sourceNote} §2.2.2、§3.1、§3.3。素材・形状は確定部品図で確認してください。</span></div></section>}

        {activeTab === '概略図' && <section className="work-card"><div className="section-topline"><div><span className="section-number">AUTOCAD / DXF R12</span><h2>AutoCAD互換の組立概略図</h2><p>AutoCADで開けるASCII DXFです。設計条件を注記した、mm単位のα形学習用概略図を書き出します。</p></div><button className="download-button" onClick={downloadDxf}><ArrowDownToLine size={15}/>DXFをダウンロード</button></div><div className="cad-specs"><span>形式 <strong>DXF R12 / AC1009</strong></span><span>単位 <strong>mm</strong></span><span>図面 <strong>α形組立概略・A3横枠</strong></span><span>画層 <strong>HOT / COLD / LINKAGE / DIM / NOTE</strong></span></div><div className="large-diagram"><LinkageDiagram stroke={values.stroke}/></div><div className="diagram-metrics"><div><span>ピストン径 Dp（指定）</span><strong>{values.bore.toFixed(1)} mm</strong></div><div><span>ストローク Sp（検討値）</span><strong>{values.stroke.toFixed(1)} mm</strong></div><div><span>位相差 α（指定）</span><strong>90°</strong></div></div><div className="safety-callout"><CircleHelp size={17}/><span><strong>出力図は概念図です。製作用CAD図面ではありません。</strong><br/>添付指導書の部品図は第三角法・原則1:1・材質・製作数等が必要です。このDXFは機構説明用で、全体形状・配置・はめあい・公差を定義しません。工作機械やワイヤカットへ直接使用せず、部品図・組立図は指導書§3と配布図面をもとに別途作成して、教員確認を受けてください。</span></div><div className="source-note"><BookOpen size={14}/><span>{sourceNote} §2.2.2、§3.1、§3.3。素材・形状は確定部品図で確認してください。</span></div></section>}

        {activeTab === '工程表' && <section className="work-card"><div className="section-topline"><div><span className="section-number">COURSE SCHEDULE / 14 WEEKS</span><h2>指導書の日程に沿った作業予定</h2><p>授業日程表と添付資料2の作業予定表に合わせた進行案です。担当者と実際の週割は班で記入してください。</p></div><button className="quiet-button" onClick={() => setActiveTab('授業の順序')}>週ごとの課題を開く <ArrowRight size={14}/></button></div><div className="schedule-overview"><div><span>設計・計算</span><strong>第1週</strong></div><div><span>製図・工程表</span><strong>第2–3週</strong></div><div><span>製作・評価・発表</span><strong>第4–14週</strong></div></div><div className="work-timeline">{lessons.map((item, index) => { const Icon = item.icon; return <button className={`work-stage schedule-stage ${completedWeeks.includes(index + 1) ? 'finished' : ''}`} key={item.title} onClick={() => { if (index + 1 <= firstIncompleteWeek || completedWeeks.includes(index + 1)) { setSelectedWeek(index + 1); setActiveTab('授業の順序'); } }} disabled={index + 1 > firstIncompleteWeek && !completedWeeks.includes(index + 1)}><div className="stage-index"><span>{String(index + 1).padStart(2, '0')}</span><i/></div><div className="stage-icon"><Icon size={16}/></div><div className="stage-copy"><strong>{item.title}</strong><p>{item.deliverable}</p></div><span className="stage-weeks">第 {index + 1} 週</span></button>;})}</div><div className="safety-callout"><BookOpen size={17}/><span><strong>日程の根拠</strong><br/>添付指導書の2026年度日程表：第1週 計算、第2週 設計・製図、第3週 工程表、第4–13週 製作①〜⑩、第14週 性能コンテスト・報告会。クラス別日付と最新連絡は授業案内を優先してください。</span></div></section>}

        {activeTab === '提出書類' && <section className="work-card"><div className="section-topline"><div><span className="section-number">CLASS SUBMISSIONS / {String(documents.length).padStart(2, '0')}</span><h2>添付資料に沿った提出・記録</h2><p>指導書の添付書式を参考にした記入用テキストとAutoCAD互換DXFを出力します。</p></div><button className="quiet-button" onClick={() => selectedDocument.includes('DXF') ? downloadDxf() : makeDocument(selectedDocument)}><Download size={14}/>選択中を保存</button></div><div className="doc-list">{documents.map((doc) => {const Icon = doc.icon;return <button className={`doc-row ${selectedDocument === doc.name ? 'selected' : ''}`} key={doc.name} onClick={() => setSelectedDocument(doc.name)}><span className="doc-icon"><Icon size={17}/></span><span className="doc-title"><strong>{doc.name}</strong><small>{doc.detail}</small></span><span className="doc-type">{doc.type}</span><span className="doc-ready"><Check size={12}/>下書き</span><ChevronRight size={15}/></button>;})}</div><div className="doc-preview"><div><FileText size={16}/><strong>出力内容</strong></div><p>計算書・設計コンセプト・記録類は内容確認用のテキストで、公式配布様式や担当職員印を置き換えません。AutoCAD図面はASCII DXF R12で出力しますが、学習用組立概略のみです。製作用の各部品図・公差・寸法は指導書と教員確認に基づいて別途作成してください。</p><button className="download-button" onClick={() => selectedDocument.includes('DXF') ? downloadDxf() : makeDocument(selectedDocument)}><ArrowDownToLine size={15}/>{selectedDocument.includes('DXF') ? 'AutoCAD用DXFをダウンロード' : `${selectedDocument}をダウンロード`}</button></div></section>}

        <footer className="engine-footer"><div><ShieldCheck size={14}/><span>設計値と加工条件は、必ず教員の確認後に使用してください。</span></div><span>STIRLING ENGINE CLASS PROJECT · 2026</span></footer>
      </div>
    </main>
  </div>;
}

export default App;
