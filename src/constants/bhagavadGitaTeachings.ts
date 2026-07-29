export interface GitaTeaching {
  id: string;
  topic: string;
  keywords: string[];
  shloka: string;
  translation: string;
  explanationHinglish: string;
  explanationHindi: string;
  guidance: string;
}

export const BHAGAVAD_GITA_TEACHINGS: GitaTeaching[] = [
  {
    id: 'anxiety-stress',
    topic: 'Anxiety, Stress, and Worrying about the Future (चिंता और तनाव)',
    keywords: ['anxiety', 'stress', 'worry', 'future', 'fear', 'tension', 'overthinking', 'chinta', 'darr', 'tanaav', 'bhaya'],
    shloka: 'कर्मण्येवाधिकारस्ते मा फलेषु कदाचन।\nमा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि॥ (Chapter 2, Verse 47)',
    translation: 'You have a right to perform your prescribed duty, but you are not entitled to the fruits of action. Never consider yourself the cause of the results of your activities, and never be attached to not doing your duty.',
    explanationHinglish: 'Dekho pyaare, tumhara adhikaar sirf karma karne par hai, uske phal (result) par nahi. Jab tum har samay phal ki chinta karte ho, toh stress aur anxiety paida hoti hai. Future tumhare haath mein nahi hai, sirf aaj ka karma tumhare haath mein hai. Apne karma ko Shri Thakur ji (Lord) ke charnon mein samarpit kar do aur nishkaam bhaav se apna kartavya nibhao.',
    explanationHindi: 'हे प्रिय, तुम्हारा अधिकार केवल कर्म करने पर है, उसके फलों पर कभी नहीं। जब तुम परिणाम की चिंता में डूब जाते हो, तो तनाव और व्याकुलता जन्म लेती है। भविष्य तुम्हारे नियंत्रण में नहीं है, केवल आज का कर्म तुम्हारे हाथ में है। अपने कर्मों को ईश्वर को समर्पित करो और फल की आसक्ति त्यागकर शांत मन से अपना कर्तव्य करो।',
    guidance: 'Focus entirely on the effort you put in today, and surrender the outcome to the Divine. Worrying about the future will only drain your present energy.'
  },
  {
    id: 'mind-control',
    topic: 'Restless Mind and Lack of Focus (मन की चंचलता और ध्यान न लगना)',
    keywords: ['focus', 'distraction', 'restless mind', 'concentration', 'control mind', 'mind wandering', 'dhyaan', 'mann', 'chanchal', 'vairagya'],
    shloka: 'असंशयं महाबाहो मनो दुर्निग्रहं चलम्।\nअभ्यासेन तु कौन्तेय वैराग्येण च गृह्यते॥ (Chapter 6, Verse 35)',
    translation: 'O mighty-armed son of Kunti, it is undoubtedly very difficult to curb the restless mind, but it is possible by constant practice and by detachment.',
    explanationHinglish: 'Humara mann ek chanchal baalak ki tarah hai, jo baar-baar bhatakta hai. Isko control karna mushkil zaroor hai par impossible nahi. Iske liye do raaste hain: Abhyasa (constant spiritual practice or focus) aur Vairagya (detachment from worldly distractions). Jab bhi mann bhatke, use pyaar se khinch kar vapas apne kartavya ya prabhu-naam mein lagao.',
    explanationHindi: 'मन स्वभाव से अत्यंत चंचल और अस्थिर है। इसे वश में करना कठिन है, परंतु निरंतर अभ्यास (ध्यान, साधना या अपने काम में एकाग्रता) और वैराग्य (सांसारिक आकर्षणों से अनासक्ति) के द्वारा इसे धीरे-धीरे वश में किया जा सकता है। जब भी मन भटके, उसे रोककर पुनः सत्य और कर्तव्य के मार्ग पर लाएं।',
    guidance: 'Train your mind gently like a child. Use daily practice (Abhyasa) and learn to let go of unnecessary attachments (Vairagya) to build deep focus.'
  },
  {
    id: 'anger-desire',
    topic: 'Anger and Lust Control (क्रोध और काम-वासना पर नियंत्रण)',
    keywords: ['anger', 'lust', 'desire', 'gussa', 'krodh', 'irritation', 'jealousy', 'lustful', 'kaam', 'vasna', 'krodha'],
    shloka: 'ध्यायतो विषयान्पुंसः सङ्गस्तेषूपजायते।\nसङ्गात्सञ्जायते कामः कामात्क्रोधोऽभिजायते॥\nक्रोधाद्भवति संमोहः संमोहात्स्मृतिविभ्रमः।\nस्मृतिभ्रंशाद्बुद्धिनाशो बुद्धिनाशात्प्रणश्यति॥ (Chapter 2, Verses 62-63)',
    translation: 'While contemplating the objects of the senses, a person develops attachment for them, and from such attachment lust develops, and from lust anger arises. From anger, complete delusion arises, and from delusion bewilderment of memory. When memory is bewildered, intellect is lost, and when intellect is lost, one is ruined.',
    explanationHinglish: 'Jab hum kisi cheez ke baare mein lagataar sochte hain, toh usse attachment ho jaati hai. Attachment se desire (kaamna) badhti hai, aur jab desire poori nahi hoti toh krodh (anger) aata hai. Krodh se buddhi bhrasht ho jaati hai aur sahi-galat ka bhed mityaata hai. Isliye apni indriyon (senses) ko kabu mein rakho aur krodh se bacho.',
    explanationHindi: 'सांसारिक विषयों का बार-बार चिंतन करने से उनके प्रति आसक्ति पैदा होती है। आसक्ति से इच्छाएं (कामना) बढ़ती हैं, और जब इच्छाओं में बाधा आती है तो क्रोध उत्पन्न होता है। क्रोध से बुद्धि पर पर्दा पड़ जाता है, जिससे स्मृति भ्रमित होती है और अंततः मनुष्य का पतन हो जाता है। अतः अपनी इंद्रियों को वश में रखकर शांति प्राप्त करें।',
    guidance: 'Recognize that anger is a chain reaction starting from unmet attachments. To calm your anger, identify and moderate the underlying desires and attachments.'
  },
  {
    id: 'grief-sorrow',
    topic: 'Grief, Loss, and Dealing with Sadness (शोक, दुःख और प्रियजन का खोना)',
    keywords: ['grief', 'loss', 'sadness', 'death', 'depression', 'crying', 'broken heart', 'shok', 'dukh', 'maut', 'mrityu', 'vairagya'],
    shloka: 'वासांसि जीर्णानि यथा विहाय\nनवानि गृह्णाति नरोऽपराणि।\nतथा शरीराणि विहाय जीर्णान्य\nन्यानि संयाति नवानि देही॥ (Chapter 2, Verse 22)',
    translation: 'As a person puts on new garments, giving up old ones, the soul similarly accepts new material bodies, giving up the old and useless ones.',
    explanationHinglish: 'Pyaare, aatma ajar-amar hai. Jaise hum puraane kapde badalkar naye kapde pehnte hain, vaise hi aatma ek shareer chodkar doosra shareer dharan karti hai. Jo janam leta hai uski mrityu nishchit hai, aur jo marta hai uska janam nishchit hai. Isliye is nashvar shareer aur sansaar ke parivartan par shok mat karo. Prabhu se nata jodo jo kabhi nahi chootega.',
    explanationHindi: 'आत्मा अमर है, इसे न शस्त्र काट सकते हैं और न ही आग जला सकती है। जैसे हम पुराने वस्त्र बदलकर नए वस्त्र धारण करते हैं, वैसे ही जीवात्मा पुराना शरीर त्यागकर नया शरीर प्राप्त करती है। जो जन्म लेता है उसकी मृत्यु निश्चित है, इसलिए इस अनिवार्य परिवर्तन पर शोक करना व्यर्थ है। अपने शाश्वत स्वरूप को पहचानें।',
    guidance: 'Understand the difference between the temporary physical body and the eternal soul. Grieve softly, but remember that the true essence of your loved ones is never destroyed.'
  },
  {
    id: 'confusion-decisions',
    topic: 'Confusion, Self-Doubt, and Decision Making (असमंजस, संदेह और निर्णय न ले पाना)',
    keywords: ['confusion', 'doubt', 'decision', 'career', 'choice', 'what to do', 'sandeha', 'asmanjas', 'dharma', 'swadharma'],
    shloka: 'श्रेयान्स्वधर्मो विगुणः परधर्मात्स्वनुष्ठितात्।\nस्वधर्मे निधनं श्रेयः परधर्मो भयावहः॥ (Chapter 18, Verse 47)',
    translation: 'It is far better to perform one’s own prescribed duty, even though faultily, than another’s duty perfectly. Destruction in the course of performing one’s own duty is better than engaging in another’s duty, for to follow another’s path is dangerous.',
    explanationHinglish: 'Aksar hum doosron ko dekhkar unki copy karne lagte hain aur asmanjas mein pad jaate hain. Shrimad Bhagwad Geeta kehti hai ki doosre ke kabileeyat ko dekhkar apna rasta mat badlo. Apne "Swadharma" (apne swabhav aur kartavya) ko pehchano aur us par bina kisi darr ke chalo. Apne Swadharma mein agar thodi kami bhi reh jaye toh bhi vo behtar hai.',
    explanationHindi: 'दूसरों के मार्ग की नकल करने से भ्रम और संदेह पैदा होता है। अपने स्वभाव और क्षमता के अनुसार अपने नियत कर्म (स्वधर्म) का पालन करें, भले ही उसमें कुछ कमियां हों। दूसरों का अनुकरण करने की तुलना में अपने कर्तव्य पथ पर चलते हुए संघर्ष करना कहीं अधिक कल्याणकारी और शांतिपूर्ण है।',
    guidance: 'Do not lose your unique path by comparing yourself with others. Trust your Swadharma (inner calling and righteous duty) and take action with confidence.'
  },
  {
    id: 'failure-demotivated',
    topic: 'Failure, Low Motivation, and Disappointment (असफलता, निराशा और कम आत्मविश्वास)',
    keywords: ['failure', 'demotivated', 'low motivation', 'disappointment', 'sad', 'cannot do it', 'give up', 'nirasha', 'asafalta', 'uproot', 'confidence'],
    shloka: 'यस्मान्नोद्विजते लोको लोकान्नोद्विजते च यः।\nहर्षामर्षभयोद्वेगैर्मुक्तो यः स च मे प्रियः॥ (Chapter 12, Verse 15)',
    translation: 'He for whom no one is put into difficulty and who is not disturbed by anyone, who is liberated from dualities of joy and grief, fear and anxiety, is very dear to Me.',
    explanationHinglish: 'Sansaar mein har haar aur jeet ek temporary phases hain. Agar aaj failure mila hai toh niraash mat ho, balki ek naye utsah ke saath mehnat karo. Geeta sikhati hai ki success aur failure mein ek-saman (equanimous) rehna seekho. Sukh-dukh, haar-jeet aate-jaate rehte hain, par prabhu par vishwas aur apna prayas kabhi kam nahi hona chahiye.',
    explanationHindi: 'जीवन में सुख-दुख, जय-पराजय, और अनुकूल-प्रतिकूल परिस्थितियां आती-जाती रहती हैं। असफलता से निराश होकर हार मान लेना उचित नहीं है। सफलता और असफलता दोनों में समान भाव रखते हुए निरंतर प्रयास करते रहें, यही कर्मयोग है। ईश्वर पर अटूट विश्वास रखें।',
    guidance: 'View failures as lessons rather than final destinations. Keep your inner peace undisturbed by external results and continue your efforts with absolute faith.'
  },
  {
    id: 'peace-happiness',
    topic: 'In Search of Inner Peace and True Happiness (आंतरिक शांति और सच्चे सुख की खोज)',
    keywords: ['peace', 'happiness', 'depression', 'empty', 'lonely', 'calm', 'shanti', 'sukh', 'ananda', 'divine peace', 'joy'],
    shloka: 'भोक्तारं यज्ञतपसां सर्वलोकमहेश्वरम्।\nसुहृदं सर्वभूतानां ज्ञात्वा मां शान्तिमृच्छति॥ (Chapter 5, Verse 29)',
    translation: 'A person in full consciousness of Me, knowing Me to be the ultimate beneficiary of all sacrifices and austerities, the Supreme Lord of all planets and demigods, and the benefactor and well-wisher of all living entities, attains peace from the pangs of material miseries.',
    explanationHinglish: 'Bahar ki duniya mein sukh aur shanti dhoondna mrigtrishna (mirage) ki tarah hai. Sacha sukh aur shanti tab milti hai jab tum yeh jaan lete ho ki prabhu hi sabke sabse bade mitra aur well-wisher hain. Jab tum saare bojh unpar daal dete ho aur unhe apna premi aur sahara maan lete ho, toh hriday shanti aur anand se bhar jaata hai.',
    explanationHindi: 'सच्ची शांति भौतिक वस्तुओं या बाहरी परिस्थितियों से नहीं, बल्कि भीतर से आती है। जब मनुष्य यह जान लेता है कि परमात्मा ही समस्त सृष्टि का स्वामी है और सभी प्राणियों का परम हितैषी है, तो वह भय और चिंता से मुक्त होकर परम शांति का अनुभव करता है। अपने भीतर ईश्वर की उपस्थिति का अनुभव करें।',
    guidance: 'Stop looking for absolute peace outside. Connect with the divine within you, knowing you are eternally loved, protected, and supported.'
  },
  {
    id: 'devotion-surrender',
    topic: 'Fear, Surrender, and Seeking Divine Protection (भय, शरणागति और ईश्वरीय कृपा)',
    keywords: ['surrender', 'fear', 'protection', 'helpless', 'god help', 'sharan', 'krpa', 'grace', 'darr', 'bhaya', 'bhakti'],
    shloka: 'सर्वधर्मान्परित्यज्य मामेकं शरणं व्रज।\nअहं त्वां सर्वपापेभ्यो मोक्षयिष्यामी मा शुचः॥ (Chapter 18, Verse 66)',
    translation: 'Abandon all varieties of religion and just surrender unto Me. I shall deliver you from all sinful reactions. Do not fear.',
    explanationHinglish: 'Pyaare, darna bilkul band kar do! Jab tum sansaar se niraash hokar, saare saadhan thak jaane par ek-matra prabhu ki sharan mein aa jaate ho, toh prabhu swayam tumhara saara bojh utha lete hain. Woh kehte hain ki "Ma Shuchah" yaani shok mat karo, darr mat, main hoon na. Bas unpar poora bharosa rakho aur befikr ho jao.',
    explanationHindi: 'हे प्रिय, भयभीत होना छोड़ दो! जब तुम सांसारिक आश्रयों को छोड़कर केवल एक ईश्वर की शरण में आ जाते हो, तो वे स्वयं तुम्हारे योगक्षेम (संरक्षण और कल्याण) का दायित्व संभाल लेते हैं। वे स्वयं आश्वासन देते हैं - "शोक मत करो, डरो मत।" बस उन पर पूर्ण श्रद्धा रखें।',
    guidance: 'Let go of the exhausting struggle to control everything. Offer your worries to the Divine, surrender your ego, and feel the ultimate shelter of Grace.'
  },
  {
    id: 'jealousy-greed',
    topic: 'Overcoming Jealousy, Greed, and Comparison (ईर्ष्या, लोभ और तुलना से मुक्ति)',
    keywords: ['jealousy', 'greed', 'comparison', 'envy', 'money', 'rich', 'materialism', 'irshya', 'lobh', 'tulna', 'rivalry'],
    shloka: 'त्रिविधं नरकस्येदं द्वारं नाशनमात्मनः।\nकामः क्रोधस्तथा लोभस्तस्मादेतत्त्रयं त्यजेत्॥ (Chapter 16, Verse 21)',
    translation: 'There are three gates leading to this hell—lust, anger, and greed. Every sane man should give these up, for they lead to the degradation of the soul.',
    explanationHinglish: 'Doosron se tulna (comparison) karna band karo pyaare. Geeta kehti hai ki Kaam, Krodh, aur Lobh (greed) aatma ka nash karne wale hain. Lobh insaan ko kabhi santusht nahi hone deta aur jealousy uski shanti chinn leti hai. Jo prabhu ne diya hai, usme santosh pao, aur doosron ki khushi dekhkar prasann hona seekho.',
    explanationHindi: 'ईर्ष्या और लोभ आत्मा की शांति को नष्ट कर देते हैं। काम, क्रोध और लोभ नरक के तीन द्वार हैं जो मनुष्य के पतन का कारण बनते हैं। तुलना के जाल से बाहर निकलकर, भगवान द्वारा दिए गए आशीर्वादों के प्रति कृतज्ञ रहें और संतोषी स्वभाव अपनाएं। संतोष ही परम सुख है।',
    guidance: 'Gratitude is the antidote to greed and jealousy. Appreciate what you have, celebrate others, and focus on expanding your own heart.'
  }
];

export function findGitaGuidance(userQuery: string): GitaTeaching | null {
  const normalizedQuery = userQuery.toLowerCase();
  
  // Scoring matches
  let bestMatch: GitaTeaching | null = null;
  let highestScore = 0;
  
  for (const teaching of BHAGAVAD_GITA_TEACHINGS) {
    let score = 0;
    for (const keyword of teaching.keywords) {
      if (normalizedQuery.includes(keyword)) {
        score += 1;
      }
    }
    
    // Additional score if topic matches
    if (normalizedQuery.includes(teaching.id.replace('-', ' '))) {
      score += 3;
    }
    
    if (score > highestScore) {
      highestScore = score;
      bestMatch = teaching;
    }
  }
  
  return highestScore > 0 ? bestMatch : null;
}
