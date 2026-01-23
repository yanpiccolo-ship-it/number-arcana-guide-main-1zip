// Pythagorean numerology letter values
const letterValues: Record<string, number> = {
  a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7, h: 8, i: 9,
  j: 1, k: 2, l: 3, m: 4, n: 5, o: 6, p: 7, q: 8, r: 9,
  s: 1, t: 2, u: 3, v: 4, w: 5, x: 6, y: 7, z: 8,
};

const vowels = ['a', 'e', 'i', 'o', 'u'];

export interface CalculationStep {
  letter: string;
  value: number;
}

export interface NumerologyResult {
  steps: CalculationStep[];
  intermediateSum: number;
  reductionSteps: number[];
  finalNumber: number;
}

// Get numeric value for a letter
export const getLetterValue = (letter: string): number => {
  const lower = letter.toLowerCase();
  return letterValues[lower] || 0;
};

// Master numbers that should NOT be reduced in numerology
const MASTER_NUMBERS = [11, 22, 33, 44];

// Reduce a number to single digit (1-9) or master number (11, 22, 33, 44)
export const reduceNumber = (num: number): { steps: number[]; final: number } => {
  const steps: number[] = [num];
  let current = num;
  
  while (current > 9 && !MASTER_NUMBERS.includes(current)) {
    const digits = current.toString().split('').map(Number);
    current = digits.reduce((sum, digit) => sum + digit, 0);
    steps.push(current);
  }
  
  return { steps, final: current };
};

// For Tarot: Always reduce to single digit (for binomial system)
export const reduceForTarot = (num: number): { masterNumber: number | null; reducedNumber: number } => {
  // If it's a master number, calculate its pair
  if (MASTER_NUMBERS.includes(num)) {
    const digits = num.toString().split('').map(Number);
    const reduced = digits.reduce((sum, d) => sum + d, 0);
    return { masterNumber: num, reducedNumber: reduced };
  }
  return { masterNumber: null, reducedNumber: num };
};

// Calculate Destiny/Name Number
export const calculateDestinyNumber = (name: string): NumerologyResult => {
  const letters = name.replace(/[^a-zA-Z]/g, '').split('');
  const steps: CalculationStep[] = letters.map(letter => ({
    letter: letter.toUpperCase(),
    value: getLetterValue(letter),
  }));
  
  const intermediateSum = steps.reduce((sum, step) => sum + step.value, 0);
  const { steps: reductionSteps, final } = reduceNumber(intermediateSum);
  
  return {
    steps,
    intermediateSum,
    reductionSteps,
    finalNumber: final,
  };
};

// Calculate Soul/Heart Desire Number (vowels only)
export const calculateSoulNumber = (name: string): NumerologyResult => {
  const letters = name.replace(/[^a-zA-Z]/g, '').split('');
  const vowelLetters = letters.filter(l => vowels.includes(l.toLowerCase()));
  
  const steps: CalculationStep[] = vowelLetters.map(letter => ({
    letter: letter.toUpperCase(),
    value: getLetterValue(letter),
  }));
  
  const intermediateSum = steps.reduce((sum, step) => sum + step.value, 0);
  const { steps: reductionSteps, final } = reduceNumber(intermediateSum);
  
  return {
    steps,
    intermediateSum,
    reductionSteps,
    finalNumber: final,
  };
};

// Calculate Personality Number (consonants only)
export const calculatePersonalityNumber = (name: string): NumerologyResult => {
  const letters = name.replace(/[^a-zA-Z]/g, '').split('');
  const consonantLetters = letters.filter(l => !vowels.includes(l.toLowerCase()));
  
  const steps: CalculationStep[] = consonantLetters.map(letter => ({
    letter: letter.toUpperCase(),
    value: getLetterValue(letter),
  }));
  
  const intermediateSum = steps.reduce((sum, step) => sum + step.value, 0);
  const { steps: reductionSteps, final } = reduceNumber(intermediateSum);
  
  return {
    steps,
    intermediateSum,
    reductionSteps,
    finalNumber: final,
  };
};

// Calculate Personal Year Number
export const calculatePersonalYearNumber = (
  birthDay: number,
  birthMonth: number,
  currentYear: number
): NumerologyResult => {
  // Sum birth day digits
  const dayDigits = birthDay.toString().split('').map(Number);
  const daySum = dayDigits.reduce((sum, d) => sum + d, 0);
  
  // Sum birth month digits
  const monthDigits = birthMonth.toString().split('').map(Number);
  const monthSum = monthDigits.reduce((sum, d) => sum + d, 0);
  
  // Sum current year digits
  const yearDigits = currentYear.toString().split('').map(Number);
  const yearSum = yearDigits.reduce((sum, d) => sum + d, 0);
  
  const steps: CalculationStep[] = [
    { letter: `Day (${birthDay})`, value: daySum },
    { letter: `Month (${birthMonth})`, value: monthSum },
    { letter: `Year (${currentYear})`, value: yearSum },
  ];
  
  const intermediateSum = daySum + monthSum + yearSum;
  const { steps: reductionSteps, final } = reduceNumber(intermediateSum);
  
  return {
    steps,
    intermediateSum,
    reductionSteps,
    finalNumber: final,
  };
};

// Number interpretations
export const numberMeanings: Record<number, { en: string; es: string; it: string; de: string; zh: string; ja: string; fr: string }> = {
  1: {
    en: 'Leadership, independence, innovation. You are a natural pioneer with strong willpower and determination. Your path involves initiating new ideas and standing on your own.',
    es: 'Liderazgo, independencia, innovación. Eres un pionero natural con fuerte voluntad y determinación. Tu camino implica iniciar nuevas ideas y mantenerte firme.',
    it: 'Leadership, indipendenza, innovazione. Sei un pioniere naturale con forte volontà e determinazione. Il tuo percorso implica l\'avvio di nuove idee e stare in piedi da solo.',
    de: 'Führung, Unabhängigkeit, Innovation. Sie sind ein natürlicher Pionier mit starkem Willen und Entschlossenheit. Ihr Weg beinhaltet das Initiieren neuer Ideen und auf eigenen Beinen zu stehen.',
    zh: '领导力、独立性、创新。您是一个天生的开拓者，拥有强大的意志力和决心。您的道路涉及发起新想法并独立自主。',
    ja: 'リーダーシップ、独立性、革新性。あなたは強い意志と決意を持った生まれながらの開拓者です。あなたの道は新しいアイデアを始め、自立することを含みます。',
    fr: 'Leadership, indépendance, innovation. Vous êtes un pionnier naturel avec une forte volonté et détermination. Votre chemin implique d\'initier de nouvelles idées et de vous tenir debout seul.',
  },
  2: {
    en: 'Cooperation, diplomacy, sensitivity. You excel in partnerships and bringing harmony to relationships. Your gift is understanding others and creating balance.',
    es: 'Cooperación, diplomacia, sensibilidad. Destacas en asociaciones y en traer armonía a las relaciones. Tu don es entender a los demás y crear equilibrio.',
    it: 'Cooperazione, diplomazia, sensibilità. Eccelli nelle partnership e nel portare armonia nelle relazioni. Il tuo dono è capire gli altri e creare equilibrio.',
    de: 'Kooperation, Diplomatie, Sensibilität. Sie zeichnen sich in Partnerschaften aus und bringen Harmonie in Beziehungen. Ihre Gabe ist es, andere zu verstehen und Balance zu schaffen.',
    zh: '合作、外交、敏感。您在合作关系中表现出色，能为关系带来和谐。您的天赋是理解他人并创造平衡。',
    ja: '協力、外交、感受性。あなたはパートナーシップに優れ、関係に調和をもたらします。あなたの才能は他者を理解し、バランスを作ることです。',
    fr: 'Coopération, diplomatie, sensibilité. Vous excellez dans les partenariats et apportez l\'harmonie aux relations. Votre don est de comprendre les autres et de créer l\'équilibre.',
  },
  3: {
    en: 'Creativity, expression, joy. You are blessed with artistic talents and the ability to inspire others through your words and creations. Embrace your natural optimism.',
    es: 'Creatividad, expresión, alegría. Estás bendecido con talentos artísticos y la capacidad de inspirar a otros a través de tus palabras y creaciones. Abraza tu optimismo natural.',
    it: 'Creatività, espressione, gioia. Sei benedetto con talenti artistici e la capacità di ispirare gli altri attraverso le tue parole e creazioni. Abbraccia il tuo ottimismo naturale.',
    de: 'Kreativität, Ausdruck, Freude. Sie sind mit künstlerischen Talenten gesegnet und der Fähigkeit, andere durch Ihre Worte und Kreationen zu inspirieren. Umarmen Sie Ihren natürlichen Optimismus.',
    zh: '创造力、表达、喜悦。您拥有艺术才华和通过言语和创作激励他人的能力。拥抱您天生的乐观精神。',
    ja: '創造性、表現、喜び。あなたは芸術的な才能と言葉や創作を通じて他者を鼓舞する能力に恵まれています。あなたの自然な楽観主義を受け入れてください。',
    fr: 'Créativité, expression, joie. Vous êtes béni avec des talents artistiques et la capacité d\'inspirer les autres à travers vos mots et créations. Embrassez votre optimisme naturel.',
  },
  4: {
    en: 'Stability, hard work, foundation. You are the builder, creating lasting structures through discipline and determination. Your strength lies in practical application.',
    es: 'Estabilidad, trabajo duro, fundación. Eres el constructor, creando estructuras duraderas a través de disciplina y determinación. Tu fuerza reside en la aplicación práctica.',
    it: 'Stabilità, duro lavoro, fondamento. Sei il costruttore, che crea strutture durature attraverso disciplina e determinazione. La tua forza risiede nell\'applicazione pratica.',
    de: 'Stabilität, harte Arbeit, Fundament. Sie sind der Baumeister, der durch Disziplin und Entschlossenheit dauerhafte Strukturen schafft. Ihre Stärke liegt in der praktischen Anwendung.',
    zh: '稳定、勤奋、基础。您是建设者，通过纪律和决心创造持久的结构。您的优势在于实际应用。',
    ja: '安定、勤勉、基盤。あなたは建設者であり、規律と決意を通じて永続的な構造を作り出します。あなたの強みは実践的な応用にあります。',
    fr: 'Stabilité, travail acharné, fondation. Vous êtes le bâtisseur, créant des structures durables par la discipline et la détermination. Votre force réside dans l\'application pratique.',
  },
  5: {
    en: 'Freedom, adventure, change. You thrive on variety and new experiences. Your path involves embracing change and using your versatility to adapt and grow.',
    es: 'Libertad, aventura, cambio. Prosperas con la variedad y las nuevas experiencias. Tu camino implica abrazar el cambio y usar tu versatilidad para adaptarte y crecer.',
    it: 'Libertà, avventura, cambiamento. Prosperi nella varietà e nelle nuove esperienze. Il tuo percorso implica abbracciare il cambiamento e usare la tua versatilità per adattarti e crescere.',
    de: 'Freiheit, Abenteuer, Veränderung. Sie gedeihen bei Vielfalt und neuen Erfahrungen. Ihr Weg beinhaltet, Veränderungen zu umarmen und Ihre Vielseitigkeit zu nutzen, um sich anzupassen und zu wachsen.',
    zh: '自由、冒险、变化。您在多样性和新体验中茁壮成长。您的道路涉及拥抱变化并利用您的多才多艺来适应和成长。',
    ja: '自由、冒険、変化。あなたは多様性と新しい経験で繁栄します。あなたの道は変化を受け入れ、適応し成長するために多才さを活用することを含みます。',
    fr: 'Liberté, aventure, changement. Vous prospérez dans la variété et les nouvelles expériences. Votre chemin implique d\'embrasser le changement et d\'utiliser votre polyvalence pour vous adapter et grandir.',
  },
  6: {
    en: 'Responsibility, love, nurturing. You are the caretaker, finding fulfillment in serving family and community. Your gift is creating beauty and harmony in home and relationships.',
    es: 'Responsabilidad, amor, nutrición. Eres el cuidador, encontrando satisfacción en servir a la familia y la comunidad. Tu don es crear belleza y armonía en el hogar y las relaciones.',
    it: 'Responsabilità, amore, nutrimento. Sei il custode, trovando appagamento nel servire la famiglia e la comunità. Il tuo dono è creare bellezza e armonia nella casa e nelle relazioni.',
    de: 'Verantwortung, Liebe, Fürsorge. Sie sind der Beschützer, der Erfüllung darin findet, Familie und Gemeinschaft zu dienen. Ihre Gabe ist es, Schönheit und Harmonie im Zuhause und in Beziehungen zu schaffen.',
    zh: '责任、爱、养育。您是照顾者，在服务家庭和社区中找到满足感。您的天赋是在家庭和关系中创造美丽与和谐。',
    ja: '責任、愛、養育。あなたは世話人であり、家族やコミュニティに奉仕することで充実感を見出します。あなたの才能は家庭と人間関係に美しさと調和を作り出すことです。',
    fr: 'Responsabilité, amour, soin. Vous êtes le protecteur, trouvant l\'épanouissement en servant la famille et la communauté. Votre don est de créer la beauté et l\'harmonie au foyer et dans les relations.',
  },
  7: {
    en: 'Wisdom, introspection, spirituality. You are the seeker of truth, drawn to understanding the deeper mysteries of life. Your path is one of inner exploration and spiritual growth.',
    es: 'Sabiduría, introspección, espiritualidad. Eres el buscador de la verdad, atraído por comprender los misterios más profundos de la vida. Tu camino es de exploración interior y crecimiento espiritual.',
    it: 'Saggezza, introspezione, spiritualità. Sei il cercatore di verità, attratto dalla comprensione dei misteri più profondi della vita. Il tuo percorso è di esplorazione interiore e crescita spirituale.',
    de: 'Weisheit, Introspektion, Spiritualität. Sie sind der Wahrheitssucher, angezogen vom Verstehen der tieferen Geheimnisse des Lebens. Ihr Weg ist einer der inneren Erforschung und spirituellen Entwicklung.',
    zh: '智慧、内省、灵性。您是真理的追寻者，被理解生命更深奥秘所吸引。您的道路是内在探索和精神成长之一。',
    ja: '知恵、内省、精神性。あなたは真実の探求者であり、人生のより深い謎を理解することに惹かれています。あなたの道は内なる探求と精神的成長の道です。',
    fr: 'Sagesse, introspection, spiritualité. Vous êtes le chercheur de vérité, attiré par la compréhension des mystères profonds de la vie. Votre chemin est celui de l\'exploration intérieure et de la croissance spirituelle.',
  },
  8: {
    en: 'Power, abundance, achievement. You have the potential for great material success and influence. Your lesson is to use power wisely and understand the spiritual nature of wealth.',
    es: 'Poder, abundancia, logro. Tienes el potencial para un gran éxito material e influencia. Tu lección es usar el poder sabiamente y entender la naturaleza espiritual de la riqueza.',
    it: 'Potere, abbondanza, successo. Hai il potenziale per un grande successo materiale e influenza. La tua lezione è usare il potere saggiamente e capire la natura spirituale della ricchezza.',
    de: 'Macht, Fülle, Erfolg. Sie haben das Potenzial für großen materiellen Erfolg und Einfluss. Ihre Lektion ist es, Macht weise zu nutzen und die spirituelle Natur des Reichtums zu verstehen.',
    zh: '力量、丰盛、成就。您有巨大物质成功和影响力的潜力。您的课题是明智地使用权力并理解财富的精神本质。',
    ja: '力、豊かさ、達成。あなたは大きな物質的成功と影響力の可能性を持っています。あなたの学びは、力を賢く使い、富の精神的な性質を理解することです。',
    fr: 'Pouvoir, abondance, accomplissement. Vous avez le potentiel pour un grand succès matériel et de l\'influence. Votre leçon est d\'utiliser le pouvoir sagement et de comprendre la nature spirituelle de la richesse.',
  },
  9: {
    en: 'Compassion, completion, humanitarianism. You are here to serve humanity and bring healing to the world. Your path involves letting go of the old to embrace universal love.',
    es: 'Compasión, finalización, humanitarismo. Estás aquí para servir a la humanidad y traer sanación al mundo. Tu camino implica soltar lo viejo para abrazar el amor universal.',
    it: 'Compassione, completamento, umanitarismo. Sei qui per servire l\'umanità e portare guarigione al mondo. Il tuo percorso implica lasciare andare il vecchio per abbracciare l\'amore universale.',
    de: 'Mitgefühl, Vollendung, Humanitarismus. Sie sind hier, um der Menschheit zu dienen und Heilung in die Welt zu bringen. Ihr Weg beinhaltet, das Alte loszulassen, um universelle Liebe zu umarmen.',
    zh: '慈悲、完成、人道主义。您在这里是为了服务人类并为世界带来治愈。您的道路涉及放下旧事物以拥抱普世之爱。',
    ja: '思いやり、完成、人道主義。あなたは人類に奉仕し、世界に癒しをもたらすためにここにいます。あなたの道は古いものを手放し、普遍的な愛を受け入れることを含みます。',
    fr: 'Compassion, achèvement, humanitarisme. Vous êtes ici pour servir l\'humanité et apporter la guérison au monde. Votre chemin implique de lâcher l\'ancien pour embrasser l\'amour universel.',
  },
  11: {
    en: 'Master Number - Intuition, illumination, inspiration. You carry a higher vibration and are meant to inspire and uplift others. Trust your intuition and embrace your role as a spiritual messenger.',
    es: 'Número Maestro - Intuición, iluminación, inspiración. Llevas una vibración más alta y estás destinado a inspirar y elevar a otros. Confía en tu intuición y abraza tu papel como mensajero espiritual.',
    it: 'Numero Maestro - Intuizione, illuminazione, ispirazione. Porti una vibrazione più alta e sei destinato a ispirare e sollevare gli altri. Fidati della tua intuizione e abbraccia il tuo ruolo di messaggero spirituale.',
    de: 'Meisterzahl - Intuition, Erleuchtung, Inspiration. Sie tragen eine höhere Schwingung und sind dazu bestimmt, andere zu inspirieren und zu erheben. Vertrauen Sie Ihrer Intuition und umarmen Sie Ihre Rolle als spiritueller Bote.',
    zh: '大师数字 - 直觉、启示、灵感。您携带更高的振动，注定要激励和提升他人。相信您的直觉，拥抱您作为精神使者的角色。',
    ja: 'マスターナンバー - 直感、啓示、インスピレーション。あなたはより高い振動を持ち、他者を鼓舞し高めることを運命づけられています。直感を信じ、精神的なメッセンジャーとしての役割を受け入れてください。',
    fr: 'Nombre Maître - Intuition, illumination, inspiration. Vous portez une vibration plus élevée et êtes destiné à inspirer et élever les autres. Faites confiance à votre intuition et embrassez votre rôle de messager spirituel.',
  },
  22: {
    en: 'Master Number - The Master Builder. You have the potential to turn dreams into reality on a grand scale. Your purpose involves creating lasting structures that benefit humanity.',
    es: 'Número Maestro - El Constructor Maestro. Tienes el potencial de convertir los sueños en realidad a gran escala. Tu propósito implica crear estructuras duraderas que beneficien a la humanidad.',
    it: 'Numero Maestro - Il Costruttore Maestro. Hai il potenziale per trasformare i sogni in realtà su larga scala. Il tuo scopo implica la creazione di strutture durature che beneficino l\'umanità.',
    de: 'Meisterzahl - Der Meisterbaumeister. Sie haben das Potenzial, Träume in großem Maßstab in die Realität umzusetzen. Ihr Zweck beinhaltet die Schaffung dauerhafter Strukturen, die der Menschheit zugute kommen.',
    zh: '大师数字 - 大师建造者。您有将梦想大规模变为现实的潜力。您的目的涉及创造造福人类的持久结构。',
    ja: 'マスターナンバー - マスタービルダー。あなたは夢を大規模に現実に変える可能性を持っています。あなたの目的は人類に恩恵をもたらす永続的な構造を作ることを含みます。',
    fr: 'Nombre Maître - Le Maître Bâtisseur. Vous avez le potentiel de transformer les rêves en réalité à grande échelle. Votre but implique de créer des structures durables qui bénéficient à l\'humanité.',
  },
};
