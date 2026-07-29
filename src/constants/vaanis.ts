import { VaaniSection } from '../types';
import { HIT_CHAURASI_VAANIS } from './hitchaurasi';
import { SHRI_HIT_MANGAL_GAAN_VAANIS } from './mangalgann';
import { RASIK_NAMAVALI_VAANIS } from './rasiknaamvali';
import { SHRI_PRIYA_JU_KI_NAMAVALI_VAANIS } from './priyajunamavali';
import { SHRI_KARUNA_BELI_VAANIS } from './karunabeli';
import { SHRI_VRINDAVAN_SHAT_LEELA_VAANIS } from './vrindavanshatleela';
import { SHRI_LAL_JU_KI_NAMAVALI_VAANIS } from './laljunamavali';
import { SHRI_VRINDAVAN_NAMAVALI_VAANIS } from './vrindavannamavali';
import { SHRI_HIT_SFUT_VAANI_VAANIS } from './sfutvaani';
import { BYALEES_LEELA_VAANIS } from './byaleesleela';
import { SHRI_HIT_RADHA_SUDHA_NIDHI_VAANIS } from './radhasudhanidhi';

export const VAANI_SECTIONS: VaaniSection[] = [
  {
    id: 'mangalacharan',
    label: 'Opening Invocation',
    title: 'मंगलाचरण',
    description: 'Recited at the beginning of all Harivanshi gatherings and path',
    vaanis: [
      {
        id: 'm1',
        title: 'श्लोक 1 — Salutation to Shri Hit Harivansh Mahaprabhu',
        text: 'प्रेमानन्दोत्पुलकित गात्रौ विद्युद्धाराधर सम कान्ति: ।\nराधा कृष्णौ मनसि दधानं वन्देहं श्रीहित हरिवंशम् ॥',
        meaning: 'I bow to Shri Hit Harivansh Ji — whose body is thrilled with the bliss of divine love, whose radiance is like a streak of lightning, and who holds Shri Radha and Krishna eternally in his heart.',
        source: 'Mangalacharan'
      },
      {
        id: 'm2',
        title: 'श्लोक 2 — The Supreme Principle: Radha-Pada-Padma-Pradhan',
        text: 'राधैवेष्टं सम्प्रदायैक-कर्ताऽऽचार्यो राधा मन्त्रद: सद्गुरुश्च ।\nमन्त्रो राधा यस्य सर्वात्मनैवं वन्दे राधा-पादपद्म-प्रधानम् ॥',
        meaning: 'He whose only beloved is Radha, who is the sole founder-Acharya of this Sampradaya, who gives the Radha-mantra as the Sadguru, whose entire soul is Radha Herself — I bow to that one for whom Shri Radha\'s lotus feet are the supreme reality.',
        source: 'Mangalacharan',
        badge: 'राधा पाद पद्म प्रधानम्'
      },
      {
        id: 'm3',
        title: 'श्लोक 3 — Praise to Hit Harivansh Ji as Vanshi Avatar',
        text: 'नमो नमो जय श्री हरिवंश ।\nरसिक अनन्य वेनुकुल मंडन, लीला मान सरोवर हंस ॥\nनमो जयति (श्री) वृन्दावन सहज माधुरी, रास विलास प्रसंस ।\nआगम निगम अगोचर राधे, चरण सरोज व्यास अवतंस ॥',
        meaning: 'Salutations to Shri Harivansh Ji — unparalleled rasik, jewel of the flute-lineage, swan on the lake of lila. Victory to the natural sweetness of Vrindavan. Shri Radha — beyond all Vedas — I bow to Your lotus feet, crown jewel of Vyas.',
        source: 'Mangalacharan'
      },
      {
        id: 'm4',
        title: 'श्लोक 4 — Salutation to Shri Radhavallabh Lal Ji (by Vyas Das Ji)',
        text: 'श्री राधावल्लभ नमो-नमो ।\nकुंज निकुंज पुंज रतिरस में रूपरासि जहाँ नमो-नमो ॥\nसुखसागर गुन नागर रसनिधि रस सुधंग रंग नमो-नमो ।\nस्याम सरीर कमल दल लोचन दुख मोचन हरि नमो-नमो ॥\nवृन्दाविपिन चंद नँद नंदन, आनंद कंद सुख नमो-नमो ।\nसर्वोंपरि सर्वोंपम निसिदिन व्यासदास प्रभु नमो-नमो ॥',
        meaning: "Salutations to Shri Radhavallabh — where love-rasa fills every kunja, ocean of joy, treasury of rasa, Shyam-bodied with lotus-petal eyes, remover of all sorrow, moon of Vrindavan, Nanda's son — day and night Vyasdas's Lord — salutations again and again!",
        source: 'Mangalacharan, by Vyas Das Ji'
      }
    ]
  },
  {
    id: 'naamavali',
    label: 'Naamavali — 3 Sections',
    title: 'नामावली',
    description: 'Sacred names of great devotees and rasiks — reciting their names is itself devotional practice',
    isGrid: true,
    vaanis: [],
    subSections: [
      {
        id: 'bhakt',
        title: 'भक्त नामावली',
        vaanis: [
          { 
            id: 'bn1', 
            title: 'Verse 1 ॥1॥', 
            text: 'हमसौं इन साधुन सौं पंगति ।\nजिनकौ नाम लेत दुख छूटत, सुख लूटत तिन संगति ॥',
            meaning: 'May we be seated in the company of these saints — whose very names remove all sorrow and whose association brings infinite joy.'
          },
          { id: 'bn2', title: 'Verse 2 ॥2॥', text: 'मुख्य महन्त काम रति गणपति, अज महेश नारायण ।\nसुर नर असुर मुनी पक्षी पशु, जे हरिभक्ति परायण ॥' },
          { id: 'bn3', title: 'Verse 3 ॥3॥', text: 'वाल्मीकि नारद अगस्त्य शुक, व्यास सूत कुलहीना ।\nशबरी स्वपच वसिष्ठ विदुर, विदुरानी प्रेम प्रवीना ॥' },
          { id: 'bn4', title: 'Verse 4 ॥4॥', text: 'गोपी गोप द्रोपदी कुंती, आदि पांडवा ऊधौ ।\nविष्णु स्वामी निम्बारक माधौ, रामानुज मग सूधौ ॥' },
          { id: 'bn5', title: 'Verse 5 ॥5॥', text: 'लालाचारज धनुर्दास, कूरेश भाव रस भीजे ।\nज्ञानदेव गुरु शिष्य लिलोचन, पटतर को किह दीजे ॥' },
          { id: 'bn6', title: 'Verse 6 ॥6॥', text: 'पद्मावती चरन को चारन, किव जयदेव जसीलौ ।\nचिन्तामणि चिद् रूप लखायो, विल्वमंगलिहि रसीलौ ॥' },
          { id: 'bn7', title: 'Verse 7 ॥7॥', text: 'केशवभट्रु श्रीभट्रु नारायण, भट्रु गदाधरभट्टा ।\nविटुलनाथ वल्लभाचारज, ब्रज के गूजर-जट्टा ॥' },
          { id: 'bn8', title: 'Verse 8 ॥8॥', text: 'नित्यानन्द अद्वैत महाप्रभु, शची सुवन चैतन्या ।\nभट्रुगोपाल रघुनाथ जीव अरु, मधु गुसाँईं धन्या ॥' },
          { id: 'bn9', title: 'Verse 9 ॥9॥', text: 'रूप सनातन भज वृन्दावन, तिज दारा सुत सम्पति ।\nव्यासदास हरिवंश गुसाईं, दिन दुलराई दम्पति ॥' },
          { id: 'bn10', title: 'Verse 10 ॥10॥', text: 'श्रीस्वामी हरिदास हमारे, विपुल बिहारिनि दासी ।\nनागिर नवल माधुरी वल्लभ, नित्य बिहार उपासी ॥' },
          { id: 'bn11', title: 'Verse 11 ॥11॥', text: 'तानसेन अकबर करमैती, मीरा करमाबाई ।\nरत्नाववती मीर माधौ, रसखान रीति रस गाई ॥' },
          { id: 'bn12', title: 'Verse 12 ॥12॥', text: 'अग्रदास नाभादि सखी ये, सबै राम सीता की ।\nसूर मदनमोहन नरसी अलि, तस्कर नवनीता की ॥' },
          { id: 'bn13', title: 'Verse 13 ॥13॥', text: 'माधौ दास गुसाईं तुलसी, कृष्णदास परमानन्द ।\nविष्णुपुरी श्रीधर मधुसूदन, पीपा गुरु रामानंद ॥' },
          { id: 'bn14', title: 'Verse 14 ॥14॥', text: 'अलि भगवान मुरारी रसिक, स्यामानन्द रंका बंका ।\nरामदास चीधर निष्किंचन, सम्हन भक्त निसंका ॥' },
          { id: 'bn15', title: 'Verse 15 ॥15॥', text: 'लाखा अंगद भक्त महाजन, गोविन्द नन्द प्रबोधा ।\nदासमुरारि प्रेमनिधि विट्टुलदास, मथुरिया योधा ॥' },
          { id: 'bn16', title: 'Verse 16 ॥16॥', text: 'लालमती सीता प्रभुता, झाली गोपाली बाई ।\nसुत विष दियौ पूजि सिलपिल्ले, भक्ति रसीली पाई ॥' },
          { id: 'bn17', title: 'Verse 17 ॥17॥', text: 'पृथ्वीराज खेमाल चतुर्भुज, राम रसिक रस रासा ।\nआसकरण मधुकर जयमल नृप, हरिदास जन दासा ॥' },
          { id: 'bn18', title: 'Verse 18 ॥18॥', text: 'सेना धना कबीरा नामा, कूबा सदन कसाई ।\nबारमुखी रैदास सभा में, सही न स्याम हँसाई ॥' },
          { id: 'bn19', title: 'Verse 19 ॥19॥', text: 'चिलकेतु प्रह्लाद विभीषण, बलि गृह बाजे बावन ।\nजामवंत हनुमन्त गीध गुह, किये राम जे पावन ॥' },
          { id: 'bn20', title: 'Verse 20 ॥20॥', text: 'प्रीति प्रतीति प्रसाद साधु सों, इन्हें इष्ट गुरु जानो ।\nतिज ऐश्वर्य मरजाद वेद की, इनके हाथ बिकानो ॥' },
          { id: 'bn21', title: 'Verse 21 ॥21॥', text: 'भूत भविष्य लोक चौदह में, भये होय हरि प्यारे ।\nतिन तिन सों व्यवहार हमारौ, अभिमानिन ते न्यारे ॥' },
          { id: 'bn22', title: 'Verse 22 ॥22॥', text: '\'भगवतरिसक\' रसिक परिकर किर, सादर भोजन पावै ।\nऊँचो कुल आचार अनादर, देखि ध्यान नहीं आवै ॥' }
        ]
      },
      {
        id: 'bhakt-byalees',
        title: 'Bhakt Namavali (Byalees leela)',
        vaanis: [BYALEES_LEELA_VAANIS[5]]
      },
      {
        id: 'rasik',
        title: 'रसिक नामावली',
        vaanis: RASIK_NAMAVALI_VAANIS
      },
      {
        id: 'priyaju',
        title: 'श्री प्रियाजू की नामावली',
        vaanis: SHRI_PRIYA_JU_KI_NAMAVALI_VAANIS
      },
      {
        id: 'lalju',
        title: 'श्रीलालजू की नामावली',
        vaanis: SHRI_LAL_JU_KI_NAMAVALI_VAANIS
      },
      {
        id: 'vrindavan',
        title: 'श्रीवृन्दावनधाम नामावली',
        vaanis: SHRI_VRINDAVAN_NAMAVALI_VAANIS
      }
    ]
  },
  {
    id: 'mangalgann',
    label: 'Mangal Gaan — 5 Pads',
    title: 'श्री हित मंगल गान',
    description: 'Glorious songs of celebration and auspiciousness in the Harivanshi tradition',
    isGrid: true,
    vaanis: SHRI_HIT_MANGAL_GAAN_VAANIS
  },
  {
    id: 'hitchaurasi',
    label: 'Shri Hit Harivansh Vaani',
    title: 'श्री हित हरिवंश वाणी',
    description: 'The sacred compositions of Shri Hit Harivansh Mahaprabhu — including the supreme Hit Chaurasi and Shri Yamunashtak',
    vaanis: [],
    subSections: [
      {
        id: 'chaurasi',
        title: 'Shri Hit Chaurasi',
        vaanis: HIT_CHAURASI_VAANIS,
        refrain: {
          label: '✦ Mangalacharan of Hit Chaurasi ✦',
          text: 'निगम अगोचर बात कहा कहौं अतिहि अनौखी ।\nउभय मीत की प्रीति-रीति चोखी ते चोखी ॥',
          meaning: 'How can I describe the words that are beyond the Vedas? They are extremely unique. The way of love between the two friends (Radha and Krishna) is the purest of the pure.'
        }
      },
      {
        id: 'yamunashtak',
        title: 'Shri Yamunashtak',
        vaanis: [
          { id: 'y1', title: 'Shloka 1', text: 'ब्रजाधिराज - नन्दनाम्बुदाभ गात्र चंदना-\nनुलेपगंधवाहिनीं भवाब्धिबीजदाहिनीम् ।\nजगत्त्रये यशस्विनीं लसत्सुधापयस्विनीं-\nभजे कलिन्दनन्दिनीं दुरंतमोहभंजनीम् ॥' },
          { id: 'y2', title: 'Shloka 2', text: 'रसैकसीमराधिकापदाब्जभक्तिसाधिकां-\nतदंगरागपिंजरप्रभातिपुंजमंजुलाम् ।\nस्वरोचिषातिशोभितां कृतां जनाधिगंजनां-\nभजे कलिन्दनन्दिनीं दुरंतमोहभंजनीम् ॥' },
          { id: 'y3', title: 'Shloka 3', text: 'ब्रजेन्द्रसूनु राधिकाहृदिप्रपूर्यमाणयो-\nर्महारसाब्धिपूरयोरिवातितीव्रवेगततः ।\nबहिः समुच्छलन्नवप्रवाहरूपिणीमहं-\nभजे कलिन्दनन्दिनीं दुरंतमोहभंजनीम् ॥' },
          { id: 'y4', title: 'Shloka 4', text: 'विचित्ररत्नवद्धसत्तटद्वयश्रियोज्जवलां-\nविचित्रहंससारसाद्यनन्तपक्षिसंकुलाम् ।\nविचित्रमीनमेखलां कृतातिदीनपालितां-\nभजे कलिन्दनन्दिनीं दुरंतमोहभंजनीम् ॥' },
          { id: 'y5', title: 'Shloka 5', text: 'वहंतिकां श्रियांहरेर्मुदा कृपास्वरूपिणीं\nविशुद्धभक्तिमुज्ज्वलां परेरसात्मिकां विदुः ।\nसुधाश्रुतित्वलौकिकीं परेशवर्णरूपिणीं-\nभजे कलिन्दनन्दिनीं दुरंतमोहभंजनीम् ॥' },
          { id: 'y6', title: 'Shloka 6', text: 'सुरेन्द्रवृन्दवन्दितां रसाधिष्ठितेवने-\nसदोपलब्धमाधवाद्भुतैकसहशोन्मदाम् ।\nअतीव विह्वलामिवच्चलत्तरंगदोलतां\nभजे कलिन्दनन्दिनीं दुरंतमोहभंजनीम् ॥' },
          { id: 'y7', title: 'Shloka 7', text: 'प्रफुल्लपंकजाननां लसन्नवोत्पलेक्षणां-\nरथांगनामयुग्मकस्तनीमुदारहंसिकाम् ।\nनितंबचारुरोधसां हरेः प्रियां रसोज्ज्वलां-\nभजे कलिन्दनन्दिनीं दुरंतमोहभंजनीम् ॥' },
          { id: 'y8', title: 'Shloka 8', text: 'समस्तवेदमस्तकैरगम्य वैभवां सदा-\nमहामुनीन्द्रनारदादिभिः सदैव भावितम् ।\nअतुल्यपामरैरपि श्रितां पुमर्थशारदां\nभजे कलिन्दनन्दिनीं दुरंतमोहभंजनीम् ॥' }
        ],
        refrain: {
          label: '✦ Common Refrain (each shloka ends with) ✦',
          text: 'भजे कलिन्दनन्दिनीं दुरंतमोहभंजनीम्',
          meaning: 'I worship Kalindanandini (Yamuna) — the destroyer of dense delusion'
        },
        phalashruti: {
          label: '✦ फलश्रुति — Shloka 9 ✦',
          text: 'य एतदष्टकं बुधस्त्रिकालमाहतः पठेत्\nकलिन्दनन्दिनीं हृदा विचिंत्य विश्वंदिताम् ।\nइहैव राधिकापतेः पदाब्जभक्तिमुत्तमां-\nमवाप्य स ध्रुवम् भवेत्परत्र तत्प्रियानुगः ॥',
          meaning: 'Whoever, a wise person, recites this Ashtaka three times daily, meditating on Yamuna in their heart — they shall attain supreme devotion to the lotus feet of Radhikapati here itself, and in the next life, become the beloved follower of Shri Radhika.'
        }
      },
      {
        id: 'radhasudhanidhi',
        title: 'Shri Hit Radha Sudha Nidhi',
        vaanis: SHRI_HIT_RADHA_SUDHA_NIDHI_VAANIS
      },
      {
        id: 'sfutvaani',
        title: 'Shri Hit Sfut Vaani',
        vaanis: SHRI_HIT_SFUT_VAANI_VAANIS
      }
    ]
  },
  {
    id: 'more-vaanis',
    label: 'More Vaanis',
    title: 'अन्य वाणियाँ',
    description: 'Additional sacred compositions by the Rasik Acharyas',
    isGrid: true,
    vaanis: [],
    subSections: [
      {
        id: 'karunabeli',
        title: 'Shri Karuna Beli',
        vaanis: SHRI_KARUNA_BELI_VAANIS
      },
      {
        id: 'vrindavanshatleela',
        title: 'Shri Vrindavan Shat Leela',
        vaanis: SHRI_VRINDAVAN_SHAT_LEELA_VAANIS
      },
      {
        id: 'yugaldhyan',
        title: 'Shri Hit Yugal Dhyan',
        vaanis: [
          { id: 'yd1', title: 'Verse 1 ॥1॥', text: 'श्रीप्रिया बदन छबि चन्द्र मनो, प्रीतम नैन चकोर ।\nप्रेम सुधारस माधुरी, पान करत निसि भोर ॥' },
          { id: 'yd2', title: 'Verse 2 ॥2॥', text: 'अंगन की छवि कहा कहो, मन में रहत विचार ।\nभूषन भये भूषनिन को, अति स्वरूप सुकुमार ॥' },
          { id: 'yd3', title: 'Verse 3 ॥3॥', text: 'सुरंग माँग मोतिनु सिहत, सीस फूल सुख मूल ।\nमोर चन्द्रिका मोहिनी, देखत भूली भूल ॥' },
          { id: 'yd4', title: 'Verse 4 ॥4॥', text: 'श्याम लाल बेंदी बनी, शोभा बढ़ी अपार ।\nप्रगट विराजत शिशन पर, मनों अनुराग सिंगार ॥' },
          { id: 'yd5', title: 'Verse 5 ॥5॥', text: 'कुण्डल कल तांटक चल, रहे अधिक झलकाइ ।\nमनो छवि के शिशि-भानु जुग, छबि कमलनि मिलि आइ ॥' },
          { id: 'yd6', title: 'Verse 6 ॥6॥', text: 'नासा बेसर नथ बनी, सोहत चञ्चुल नैन ।\nदेखत भाँति सुहावनी, मोहे कोटिक मैन ॥' },
          { id: 'yd7', title: 'Verse 7 ॥7॥', text: 'सुन्दर चिबुक कपोल मृदु, अधर सुरंग सुदेश ।\nमुसिकनि वरषत फूल सुख, किह न सकत छबि लेश ॥' },
          { id: 'yd8', title: 'Verse 8 ॥8॥', text: 'अंगिन भूषनि झलकि रहे, अरु अञ्जन रंग पान ।\nनवसत सरवर ते मनौ, निकसे किर अस्नान ॥' },
          { id: 'yd9', title: 'Verse 9 ॥9॥', text: 'किहि न सकत अंगिन प्रभा, कुंज भवन रह्यौ छाइ ।\nमानो बागे रूपके, पिहिरे दुहिन बनाइ ॥' },
          { id: 'yd10', title: 'Verse 10 ॥10॥', text: 'रतनागंद पहुंची बनी, वलया वलय सुढार ।\nअंगुरिनु मुंदरी फिब रही, अरु मेहँदी रंग सार ॥' },
          { id: 'yd11', title: 'Verse 11 ॥11॥', text: 'चन्द्रहार मुक्तावली, राजत दुलरी पोति ।\nपानि पिंदक उर जगमगे, प्रतिविम्बित अंग जोति ॥' },
          { id: 'yd12', title: 'Verse 12 ॥12॥', text: 'मिनमय किंकिनि जाल छवि, कहौं जोइ सोइ थोर ।\nमनौं रूप दीपावली, झलमलात चहुं ओर ॥' },
          { id: 'yd13', title: 'Verse 13 ॥13॥', text: 'जेहिर सुमिलि अनूप बनी, नूपुर अनवट चारि ।\nऔर छाँड़िके या छबिहिं, हिय कै नैन निहार ॥' },
          { id: 'yd14', title: 'Verse 14 ॥14॥', text: 'बिछुवनि की छवि कहा कहौं, उपजत रव रूचि-दैन ।\nमनौं सावक कल हंस के, बोलत अति मृदु बैन ॥' },
          { id: 'yd15', title: 'Verse 15 ॥15॥', text: 'नख पल्लव सुठि सोहने, शोभा बढ़ी सुभाइ ।\nमानौं छवि चन्द्रावली, कंज दलिन लिग आइ ॥' },
          { id: 'yd16', title: 'Verse 16 ॥16॥', text: 'गौर वरन सांवल चरण, रिचि मेंहदी के रंग ।\nतिन तरुवनि तर लुठत रहैं, रित जुत कोटि अनंग ॥' },
          { id: 'yd17', title: 'Verse 17 ॥17॥', text: 'अति सुकुमारी लाड़िली, पिय किशोर सुकुमार ।\nइक छत प्रेम छके रहैं, अदभुत प्रेम विहार ॥' },
          { id: 'yd18', title: 'Verse 18 ॥18॥', text: 'अनुपम श्यामल गौर छवि, सदा बसहु मम चित्त ।\nजैसैं घन अरु दामिनी, एक संग रहैं नित्त ॥' },
          { id: 'yd19', title: 'Verse 19 ॥19॥', text: 'ऐसी छवि हिय में बसौ, और न कछु सुहाइ ।\nव्यासदास प्रभु लाड़िली, प्रीतम कुंज सहाइ ॥' },
          { id: 'yd20', title: 'Verse 20 ॥20॥', text: 'सदा बसौ वृन्दावन, कुंज भवन सुख रासि ।\nजहाँ विराजत लाड़िली, प्रीतम नित्य विलासि ॥' }
        ]
      },
      {
        id: 'byaleesleela',
        title: 'Byalees Leela',
        vaanis: BYALEES_LEELA_VAANIS
      }
    ]
  }
];
