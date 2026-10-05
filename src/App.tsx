import { useMemo, useState } from 'react';
import { Activity, ArrowDownToLine, ArrowRight, ArrowUpRight, BookOpen, Building2, CalendarDays, Check, CheckCircle2, ChevronDown, ChevronRight, CircleHelp, Clock3, Download, FileCheck2, FileSpreadsheet, FileText, FolderOpen, Layers3, Lightbulb, MapPin, MoreHorizontal, Pencil, Plus, Ruler, Sparkles, WandSparkles } from 'lucide-react';

type Project = { name: string; type: string; location: string; area: string; floors: string; structure: string; budget: string; concept: string };
const initialProject: Project = {
  name: '余白を愉しむ、小さな喫茶室', type: '店舗', location: '東京都 世田谷区', area: '42', floors: '1', structure: '木造', budget: '1,200',
  concept: '住宅街の路地にひっそりと佇む、12席の小さな喫茶室。左官の壁と無垢材のカウンター、庭の緑が見える窓辺をつくりたい。朝の光が気持ちよく、地域の人がゆっくり過ごせる場所。',
};
const money = (v: number) => `¥${Math.round(v).toLocaleString('ja-JP')}万`;

function buildPlan(p: Project) {
  const area = Math.max(10, Number(p.area) || 42);
  const multiplier = p.type === '住宅' ? 1.65 : p.type === '事務所' ? 1.35 : 1.5;
  const budget = Math.max(100, Number(p.budget) || 1200);
  const efficiency = p.type === '住宅' ? 0.82 : 0.88;
  const usable = Math.round(area * efficiency);
  const room = Math.round(usable * 0.48);
  const kitchen = Math.round(usable * 0.2);
  const circulation = usable - room - kitchen;
  const estimated = area * multiplier;
  const weeks = Math.max(12, Math.ceil(area / 5) + (p.floors === '2' ? 5 : 0));
  const docs = [
    { name: '設計概要書', sub: 'プロジェクトの基本方針と計画概要', icon: FileText, tag: '基本資料', ready: true },
    { name: '面積・規模計算書', sub: '用途別面積・概算規模の算定', icon: FileSpreadsheet, tag: '計算書', ready: true },
    { name: '平面計画図', sub: 'ゾーニングに基づく概略平面図', icon: Layers3, tag: '図面', ready: true },
    { name: '概算工事費内訳書', sub: '工種別の概算費用と予備費', icon: FileSpreadsheet, tag: '見積資料', ready: true },
    { name: '作業工程表', sub: `${weeks}週間の想定スケジュール`, icon: CalendarDays, tag: '工程', ready: true },
    { name: '仕上げ・素材計画書', sub: 'コンセプトに合わせた素材候補', icon: BookOpen, tag: '仕様書', ready: true },
  ];
  return { area, usable, room, kitchen, circulation, estimated, weeks, budget, docs };
}

function FloorPlan({ area, type }: { area: number; type: string }) {
  const isHome = type === '住宅';
  const planHeight = isHome ? 194 : 172;
  return <svg className="floor-svg" viewBox="0 0 440 248" role="img" aria-label="コンセプトから自動作成したゾーニング平面図">
    <defs><pattern id="grid" width="12" height="12" patternUnits="userSpaceOnUse"><path d="M 12 0 L 0 0 0 12" fill="none" stroke="#e9e7e0" strokeWidth="0.65"/></pattern></defs>
    <rect width="440" height="248" fill="#fbfaf7"/><rect width="440" height="248" fill="url(#grid)"/>
    <g transform={`translate(68 ${isHome ? 24 : 35})`}>
      <rect x="0" y="0" width="304" height={planHeight} fill="#fffdf8" stroke="#474943" strokeWidth="2.6"/>
      <rect x="3" y="3" width="164" height={planHeight - 6} fill="#dbe8d5"/>
      <rect x="170" y="3" width="131" height={Math.round((planHeight - 6) * .55)} fill="#f4e8d4"/>
      <rect x="170" y={Math.round(planHeight * .57)} width="131" height={Math.round((planHeight - 6) * .41)} fill="#e4e9dd"/>
      <path d={`M167 0V${planHeight} M170 ${Math.round(planHeight * .55)}H304`} stroke="#474943" strokeWidth="2.2"/>
      <path d={`M 96 ${planHeight} v-26 h34 M 239 ${Math.round(planHeight * .55)} v-25 h32`} fill="none" stroke="#777a70" strokeWidth="1.2"/>
      <rect x="17" y="15" width="60" height="6" rx="2" fill="#c9d2c1"/><rect x="17" y={planHeight-22} width="60" height="6" rx="2" fill="#c9d2c1"/>
      <rect x="16" y={Math.round(planHeight*.48)} width="39" height="28" rx="2" fill="#aa987e"/><rect x="62" y={Math.round(planHeight*.48)} width="39" height="28" rx="2" fill="#aa987e"/>
      <circle cx="32" cy={Math.round(planHeight*.35)} r="6" fill="#73896a"/><circle cx="121" cy={Math.round(planHeight*.36)} r="6" fill="#73896a"/><circle cx="144" cy={Math.round(planHeight*.7)} r="6" fill="#73896a"/>
      <rect x="187" y="17" width="95" height="16" rx="4" fill="#bb8a61"/><circle cx="211" cy="52" r="5" fill="#d0b693"/><circle cx="261" cy="52" r="5" fill="#d0b693"/>
      <rect x="188" y={Math.round(planHeight*.72)} width="72" height="14" rx="3" fill="#9e9c82"/>
      <text x="84" y={Math.round(planHeight*.26)} textAnchor="middle" className="plan-room">客席・滞在</text>
      <text x="84" y={Math.round(planHeight*.26)+15} textAnchor="middle" className="plan-area">{Math.round(area * .48 * 1.1)}㎡</text>
      <text x="236" y="77" textAnchor="middle" className="plan-room">{isHome ? '水まわり' : '厨房'}</text><text x="236" y="91" textAnchor="middle" className="plan-area">{Math.round(area * .2)}㎡</text>
      <text x="236" y={Math.round(planHeight*.86)} textAnchor="middle" className="plan-room">{isHome ? '収納・玄関' : 'バックヤード'}</text>
      <text x="4" y="-9" className="plan-dim">{Math.round(Math.sqrt(area * 1.35)) * 910} mm</text>
      <text x="-14" y={planHeight/2} textAnchor="middle" transform={`rotate(-90 -14 ${planHeight/2})`} className="plan-dim">{Math.round((area * 1.35 / Math.sqrt(area * 1.35)) * 910)} mm</text>
    </g><text x="220" y="239" textAnchor="middle" className="plan-caption">CONCEPTUAL ZONING / NOT TO SCALE</text>
  </svg>;
}

function App() {
  const [project, setProject] = useState(initialProject);
  const [generated, setGenerated] = useState(true);
  const [activeTab, setActiveTab] = useState('概要');
  const [selectedDoc, setSelectedDoc] = useState('設計概要書');
  const [notice, setNotice] = useState('');
  const [generating, setGenerating] = useState(false);
  const plan = useMemo(() => buildPlan(project), [project]);
  const update = (key: keyof Project, value: string) => setProject((old) => ({ ...old, [key]: value }));
  const generate = () => {
    setGenerating(true); setNotice('');
    window.setTimeout(() => { setGenerating(false); setGenerated(true); setActiveTab('概要'); setNotice('計画のたたき台を更新しました'); }, 550);
  };
  const download = () => {
    const text = `【${selectedDoc}】\n${project.name}\n\n用途：${project.type}\n所在地：${project.location}\n構造：${project.structure}\n延床面積：約${plan.area}㎡\n有効計画面積：約${plan.usable}㎡\n概算工事費：約${money(plan.estimated)}（条件により変動）\n想定工期：約${plan.weeks}週間\n\n設計コンセプト\n${project.concept}\n\n※本資料は入力情報に基づく初期検討用の参考資料です。法規適合性・構造安全性・実際の費用を保証するものではありません。正式な提出・施工の前に、必ず有資格者の確認と現地調査を行ってください。`;
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob); const link = document.createElement('a'); link.href = url; link.download = `${selectedDoc}_${project.name}.txt`; link.click(); URL.revokeObjectURL(url);
    setNotice(`${selectedDoc}をダウンロードしました`);
  };
  return <div className="app-shell">
    <aside className="sidebar">
      <div className="brand"><div className="brand-mark"><span></span><span></span><span></span></div><div><strong>かたち</strong><small>CONCEPT STUDIO</small></div></div>
      <div className="workspace-label">WORKSPACE <ChevronDown size={13}/></div>
      <button className="workspace-switch"><div className="workspace-avatar">K</div><span>木と余白デザイン</span><MoreHorizontal size={17}/></button>
      <div className="side-section-title">プロジェクト</div>
      <button className="nav-link active"><FolderOpen size={17}/>プロジェクト一覧<span className="nav-count">4</span></button>
      <button className="nav-link"><Clock3 size={17}/>最近見た項目</button>
      <button className="nav-link"><FileCheck2 size={17}/>書類テンプレート</button>
      <button className="new-project" onClick={() => {setProject(initialProject); setGenerated(false); setActiveTab('概要');}}><Plus size={16}/>新しいプロジェクト</button>
      <div className="sidebar-spacer"></div>
      <div className="help-card"><div className="help-icon"><CircleHelp size={17}/></div><div><strong>使い方に迷ったら</strong><small>ガイドを見る <ArrowUpRight size={11}/></small></div></div>
      <button className="profile"><div className="profile-avatar">MK</div><div><strong>森川 健太</strong><small>フリープラン</small></div><MoreHorizontal size={18}/></button>
    </aside>
    <main className="main-area">
      <header className="topbar"><div className="breadcrumb">プロジェクト一覧 <ChevronRight size={14}/> <span>{project.name}</span></div><div className="top-actions"><span className="saved"><span></span>すべて保存済み</span><button className="icon-button" aria-label="ヘルプ"><CircleHelp size={17}/></button><div className="top-avatar">MK</div></div></header>
      <div className="content">
        <div className="page-heading"><div><div className="eyebrow"><span className="eyebrow-dot"></span>PROJECT / 2025 — 004</div><h1>{project.name}</h1><div className="project-meta"><span><Building2 size={14}/>{project.type}</span><span><MapPin size={14}/>{project.location || '所在地未設定'}</span><span><Ruler size={14}/>{project.area || '0'}㎡</span><span className="status-pill"><span></span>検討中</span></div></div><button className="outline-button"><MoreHorizontal size={18}/><span>その他</span></button></div>
        <div className="tabs"><button className={activeTab === '概要' ? 'tab active' : 'tab'} onClick={() => setActiveTab('概要')}>概要</button><button className={activeTab === '設計条件' ? 'tab active' : 'tab'} onClick={() => setActiveTab('設計条件')}>設計条件</button><button className={activeTab === '書類一覧' ? 'tab active' : 'tab'} onClick={() => setActiveTab('書類一覧')}>書類一覧 <span className="tab-badge">{plan.docs.length}</span></button><button className={activeTab === '工程表' ? 'tab active' : 'tab'} onClick={() => setActiveTab('工程表')}>工程表</button></div>
        {notice && <div className="notice"><CheckCircle2 size={16}/>{notice}<button onClick={() => setNotice('')}>閉じる</button></div>}
        {!generated && <section className="concept-card"><div className="section-heading"><div><span className="step-label">STEP 01 <span>コンセプトを入力</span></span><h2>どんな空間をつくりたいですか？</h2><p>イメージを言葉にするだけで、設計のたたき台を作成します。</p></div><div className="sparkle-orb"><WandSparkles size={19}/></div></div><label className="field-label" htmlFor="concept">DESIGN CONCEPT</label><textarea id="concept" className="concept-input" value={project.concept} onChange={(e) => update('concept',e.target.value)} placeholder="例：自然素材を使った、光がたっぷり入る小さなカフェ…"/><div className="concept-hint"><Lightbulb size={14}/>用途・雰囲気・素材・過ごし方など、自由に書いてください</div><div className="fields-grid"><label className="form-field"><span>プロジェクト名</span><input value={project.name} onChange={(e)=>update('name',e.target.value)}/></label><label className="form-field"><span>用途</span><select value={project.type} onChange={(e)=>update('type',e.target.value)}><option>店舗</option><option>住宅</option><option>事務所</option><option>宿泊施設</option><option>その他</option></select></label><label className="form-field"><span>所在地（任意）</span><input value={project.location} onChange={(e)=>update('location',e.target.value)}/></label><label className="form-field"><span>延床面積の目安（㎡）</span><div className="input-suffix"><input type="number" min="10" value={project.area} onChange={(e)=>update('area',e.target.value)}/><span>㎡</span></div></label><label className="form-field"><span>階数</span><select value={project.floors} onChange={(e)=>update('floors',e.target.value)}><option value="1">1階</option><option value="2">2階</option><option value="3">3階</option></select></label><label className="form-field"><span>構造</span><select value={project.structure} onChange={(e)=>update('structure',e.target.value)}><option>木造</option><option>鉄骨造</option><option>RC造</option><option>未定</option></select></label><label className="form-field"><span>予算の目安（万円）</span><div className="input-suffix"><input type="number" value={project.budget} onChange={(e)=>update('budget',e.target.value)}/><span>万円</span></div></label></div><div className="form-footer"><span><Activity size={14}/>入力内容は自動保存されます</span><button className="primary-button" onClick={generate} disabled={generating}><Sparkles size={16}/>{generating ? '計画を作成中…' : '計画のたたき台を作成'}<ArrowRight size={15}/></button></div></section>}
        {generated && <>
          {activeTab === '設計条件' && <section className="concept-card compact-card"><div className="section-heading"><div><span className="step-label">PROJECT BRIEF</span><h2>設計条件を編集</h2><p>条件を変更してから「再計算」を押すと、計画のたたき台に反映されます。</p></div><div className="sparkle-orb"><Pencil size={18}/></div></div><label className="field-label" htmlFor="concept-edit">DESIGN CONCEPT</label><textarea id="concept-edit" className="concept-input" value={project.concept} onChange={(e)=>update('concept',e.target.value)}/><div className="fields-grid">{([['name','プロジェクト名'],['location','所在地'],['area','延床面積（㎡）'],['budget','予算目安（万円）']] as const).map(([key,label])=><label className="form-field" key={key}><span>{label}</span><input value={project[key]} onChange={(e)=>update(key,e.target.value)}/></label>)}<label className="form-field"><span>用途</span><select value={project.type} onChange={(e)=>update('type',e.target.value)}><option>店舗</option><option>住宅</option><option>事務所</option><option>宿泊施設</option><option>その他</option></select></label><label className="form-field"><span>構造</span><select value={project.structure} onChange={(e)=>update('structure',e.target.value)}><option>木造</option><option>鉄骨造</option><option>RC造</option><option>未定</option></select></label></div><div className="form-footer"><span><Activity size={14}/>入力内容は自動保存されます</span><button className="primary-button" onClick={generate} disabled={generating}><Sparkles size={16}/>{generating ? '再計算中…' : '条件を反映して再計算'}<ArrowRight size={15}/></button></div></section>}
          {activeTab === '書類一覧' && <section className="docs-panel"><div className="panel-heading"><div><div className="eyebrow">DOCUMENTS / 06</div><h2>作成できる書類</h2><p>プロジェクト情報をもとに、提出資料の下書きを用意しました。</p></div><button className="small-outline" onClick={download}><Download size={15}/>選択中をダウンロード</button></div><div className="document-list">{plan.docs.map((doc)=>{const Icon=doc.icon; return <button className={`document-row ${selectedDoc===doc.name?'selected':''}`} onClick={()=>setSelectedDoc(doc.name)} key={doc.name}><div className="doc-icon"><Icon size={18}/></div><div className="doc-copy"><strong>{doc.name}</strong><small>{doc.sub}</small></div><span className="doc-tag">{doc.tag}</span><span className="ready"><Check size={13}/>下書き</span><ChevronRight size={16} className="doc-arrow"/></button>})}</div></section>}
          {activeTab === '工程表' && <section className="schedule-panel"><div className="panel-heading"><div><div className="eyebrow">PROJECT TIMELINE / DRAFT</div><h2>作業工程表</h2><p>面積と階数から算出した、標準的な想定スケジュールです。</p></div><button className="small-outline" onClick={()=>{setSelectedDoc('作業工程表');download()}}><Download size={15}/>工程表をダウンロード</button></div><div className="timeline-summary"><CalendarDays size={17}/><span>想定期間</span><strong>約 {plan.weeks} 週間</strong><small>設計開始から竣工まで</small></div><div className="gantt"><div className="gantt-head"><span>工程</span>{['1–2週','3–4週','5–6週','7–8週','9–10週','11–12週',`${plan.weeks}週〜`].map(x=><span key={x}>{x}</span>)}</div>{[['基本計画',0,2,'sage'],['実施設計',1,3,'blue'],['確認申請・発注',3,2,'sand'],['基礎・躯体工事',4,3,'terra'],['内装・設備工事',5,2,'sage'],['検査・引き渡し',6,1,'blue']].map(([name,start,span,color])=><div className="gantt-row" key={String(name)}><span className="gantt-name">{name}</span><div className="gantt-track">{Array.from({length:7},(_,i)=><span className="gantt-cell" key={i}/>)}<span className={`gantt-bar ${color}`} style={{left:`${Number(start)/7*100}%`,width:`${Number(span)/7*100}%`}}/></div></div>)}</div><div className="schedule-note"><CircleHelp size={14}/>規模・申請条件・施工体制により工程は変動します。実施設計時に専門家と調整してください。</div></section>}
          {activeTab === '概要' && <>
            <div className="overview-grid"><section className="concept-card summary-card"><div className="section-heading"><div><span className="step-label">STEP 01 <span>コンセプト</span></span><h2>空間づくりの出発点</h2></div><button className="edit-button" onClick={()=>setActiveTab('設計条件')}><Pencil size={14}/>編集</button></div><p className="concept-quote">「{project.concept}」</p><div className="tags"><span>{project.type}</span><span>{project.structure}</span><span>{project.floors}階建て</span></div><button className="text-button" onClick={()=>setActiveTab('設計条件')}>設計条件を確認する <ArrowRight size={14}/></button></section>
              <section className="stats-card"><div className="stats-head"><div><span className="step-label">STEP 02 <span>数値計画</span></span><h2>計画の目安</h2></div><span className="auto-badge"><Sparkles size={12}/>自動算出</span></div><div className="stat-row"><div className="stat-icon green"><Ruler size={17}/></div><div className="stat-label"><span>計画面積</span><small>有効面積の目安</small></div><div className="stat-number">約 {plan.usable}<small>㎡</small></div></div><div className="stat-row"><div className="stat-icon amber"><Activity size={17}/></div><div className="stat-label"><span>概算工事費</span><small>坪単価想定から算出</small></div><div className="stat-number">{money(plan.estimated)}</div></div><div className="stat-row"><div className="stat-icon blue"><CalendarDays size={17}/></div><div className="stat-label"><span>想定工期</span><small>設計〜竣工の目安</small></div><div className="stat-number">約 {plan.weeks}<small>週間</small></div></div><div className="cost-meter"><div><span>予算目安</span><strong>{money(plan.budget)}</strong></div><div className="meter-track"><span style={{width:`${Math.min(100,plan.estimated/plan.budget*100)}%`}}/></div><small>概算費用は地域・仕様により大きく変動します</small></div></section></div>
            <section className="plan-card"><div className="panel-heading"><div><span className="step-label">STEP 03 <span>空間計画</span></span><h2>ゾーニング平面図</h2><p>コンセプトから読み取った空間構成のイメージ</p></div><button className="small-outline" onClick={()=>{setSelectedDoc('平面計画図');download()}}><ArrowDownToLine size={15}/>図面を保存</button></div><div className="plan-layout"><div className="plan-wrap"><FloorPlan area={plan.area} type={project.type}/></div><div className="area-breakdown"><div className="breakdown-heading">面積構成 <span>合計 約 {plan.usable}㎡</span></div><div className="breakdown-item"><span className="break-dot dot-green"/>客席・滞在エリア <strong>{plan.room}㎡</strong></div><div className="breakdown-item"><span className="break-dot dot-sand"/>{project.type==='住宅'?'水まわり':'厨房'} <strong>{plan.kitchen}㎡</strong></div><div className="breakdown-item"><span className="break-dot dot-gray"/>動線・その他 <strong>{plan.circulation}㎡</strong></div><div className="legend-note"><span></span>概略ゾーニング・縮尺なし</div></div></div><div className="plan-footnote"><CircleHelp size={14}/>この図面は初期検討用のイメージ図です。寸法・法規・構造を反映した施工図ではありません。</div></section>
            <section className="docs-panel"><div className="panel-heading"><div><span className="step-label">STEP 04 <span>提出書類</span></span><h2>書類の下書き</h2><p>プロジェクト情報から、各種資料のたたき台を作成しました。</p></div><button className="text-button" onClick={()=>setActiveTab('書類一覧')}>すべて見る <ArrowRight size={14}/></button></div><div className="document-list">{plan.docs.slice(0,4).map((doc)=>{const Icon=doc.icon;return <button className="document-row" key={doc.name} onClick={()=>{setSelectedDoc(doc.name);setActiveTab('書類一覧')}}><div className="doc-icon"><Icon size={18}/></div><div className="doc-copy"><strong>{doc.name}</strong><small>{doc.sub}</small></div><span className="doc-tag">{doc.tag}</span><span className="ready"><Check size={13}/>下書き</span><ChevronRight size={16} className="doc-arrow"/></button>})}</div></section>
          </>}
        </>}
        <div className="disclaimer"><div className="disclaimer-icon"><CircleHelp size={16}/></div><div><strong>ご利用にあたって</strong><p>このアプリが生成する数値・図面・工程表・書類は、入力情報から自動生成された初期検討用の参考資料です。法令への適合、構造安全性、工事費、工期を保証するものではありません。正式な申請・提出・施工には使用せず、必ず建築士等の有資格者による確認、現地調査および関係法令の確認を行ってください。</p></div></div>
        <footer className="footer"><span>© 2025 かたち — Concept Studio</span><span>ひとつのアイデアから、かたちに。</span></footer>
      </div>
    </main>
  </div>;
}

export default App;
