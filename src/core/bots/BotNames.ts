const BOT_NAME_POOL: string[] = [
  // Historical Leaders
  "Napoleon", "Caesar", "Alexander", "Cleopatra", "Hannibal", "Attila",
  "Charlemagne", "Suleiman", "Genghis Khan", "Saladin", "Tamerlane",
  "Shaka Zulu", "Sun Tzu", "Ramesses", "Boudicca", "Cyrus", "Leonidas",
  "Scipio", "Theodora", "Wu Zetian", "Pachacuti", "Moctezuma", "Bolivar",
  "Frederick the Great", "Bismarck", "Wellington", "Nelson", "Tokugawa",
  "Nobunaga", "Hideyoshi", "Yi Sun-sin", "Ashoka", "Chandragupta", "Akbar",
  "Sitting Bull", "Geronimo", "Toussaint", "Vlad", "Skanderbeg", "El Cid",
  "Baybars", "Kublai Khan", "Batu Khan", "Babur", "Ranjit Singh",
  "Gustavus Adolphus", "Jan Sobieski", "Marlborough", "Vercingetorix",
  "Zheng He", "Ragnar", "Ivar", "Harald", "Rollo", "Leif Erikson",

  // Ancient Kingdoms & Empires
  "Rome", "Carthage", "Sparta", "Athens", "Persia", "Babylon", "Assyria",
  "Macedonia", "Egypt", "Phoenicia", "Sumer", "Akkad", "Hittites", "Nubia",
  "Kush", "Axum", "Parthia", "Scythia", "Thrace", "Illyria", "Gaul",
  "Britannia",

  // Medieval Kingdoms
  "Byzantium", "Normandy", "Burgundy", "Castile", "Aragon", "Navarre",
  "Leon", "Portugal", "Scotland", "Ireland", "Wales", "Denmark", "Norway",
  "Sweden", "Poland", "Hungary", "Bohemia", "Serbia", "Bulgaria", "Croatia",
  "Lithuania", "Prussia", "Saxony", "Bavaria", "Flanders", "Lombardy",
  "Tuscany", "Venice", "Genoa", "Pisa", "Sicily", "Naples", "Antioch",
  "Jerusalem", "Trebizond", "Novgorod", "Kiev", "Moscow", "Muscovy",

  // Islamic Caliphates & Sultanates
  "Umayyad", "Abbasid", "Fatimid", "Seljuk", "Mamluk", "Ayyubid",
  "Timurid", "Safavid", "Ottoman", "Mughal", "Delhi", "Ghaznavid",
  "Almohad", "Almoravid", "Mali", "Songhai", "Kilwa", "Zanzibar",

  // Asian Empires & Dynasties
  "Han", "Tang", "Song", "Ming", "Qing", "Zhou", "Qin", "Mongol", "Yuan",
  "Joseon", "Goryeo", "Silla", "Yamato", "Heian", "Kamakura", "Ashikaga",
  "Edo", "Maurya", "Gupta", "Chola", "Vijayanagara", "Maratha", "Khmer",
  "Majapahit", "Srivijaya", "Ayutthaya", "Pagan", "Champa", "Dai Viet",

  // African Kingdoms
  "Benin", "Ashanti", "Zulu", "Ndebele", "Mutapa", "Kongo", "Luba",
  "Oyo", "Dahomey", "Kanem", "Bornu", "Sokoto", "Ethiopia", "Meroe",
  "Aksum", "Zimbabwe", "Ghana",

  // Native American Empires
  "Aztec", "Inca", "Maya", "Olmec", "Toltec", "Zapotec", "Mississippian",
  "Iroquois", "Cherokee", "Comanche", "Sioux", "Cheyenne", "Apache",
  "Navajo", "Pueblo", "Cree", "Ojibwe", "Huron", "Mohawk", "Seminole",

  // Modern Nations
  "America", "Britain", "France", "Germany", "Russia", "China", "Japan",
  "Brazil", "India", "Italy", "Spain", "Turkey", "Iran", "Mexico",
  "Argentina", "Canada", "Australia", "Indonesia", "Nigeria", "Pakistan",
  "Vietnam", "Thailand", "Ukraine", "Netherlands", "Belgium", "Finland",
  "Greece", "Austria", "Switzerland", "Israel", "Saudi Arabia", "Iraq",
  "Syria", "Algeria", "Morocco", "Kenya", "Tanzania", "Ghana", "Angola",
  "Zimbabwe", "South Africa", "Colombia", "Peru", "Chile", "Venezuela",
  "Cuba", "Panama", "Jamaica", "Haiti",

  // Fantasy & Fun
  "Dragon Empire", "Shadow Realm", "Iron Brotherhood", "Storm Legion",
  "Golden Horde", "Silver Covenant", "Blood Pact", "Jade Dynasty",
  "Obsidian Order", "Crimson Alliance", "Azure Federation",
  "Eternal Kingdom", "Ancient Republic", "Rising Dominion",
  "Northern Imperium", "Eastern Sultanate", "Western Khanate",
  "Holy Conclave", "Sacred Tribunal", "Iron Wolves", "Storm Ravens",
  "Blood Eagles", "Shadow Foxes", "Golden Lions", "Steel Falcons",
  "Bronze Dragons", "Silver Bears", "The Collective", "The Order",
  "The Legion", "The Brotherhood", "The Covenant", "The Alliance",
];

/**
 * Returns N unique bot names shuffled from the full pool.
 * If count > pool size, wraps around with a suffix to avoid duplicates.
 */
export function getRandomBotNames(count: number): string[] {
  const pool = [...BOT_NAME_POOL];
  // Fisher-Yates shuffle
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  if (count <= pool.length) {
    return pool.slice(0, count);
  }
  // If more names needed than pool size, cycle with numeric suffix
  const result = [...pool];
  let extra = count - pool.length;
  let cycle = 1;
  while (extra > 0) {
    for (let i = 0; i < pool.length && extra > 0; i++, extra--) {
      result.push(`${pool[i]} ${cycle + 1}`);
    }
    cycle++;
  }
  return result;
}
