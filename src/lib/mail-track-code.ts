/**
 * RegExp:
 * - UK Postcode District (Loose Match)  `[A-Za-z]{1,2}[\d]{1,2}[A-Za-z]{0,1}`
 * - UK Postcode Sector (Loose Match)    `[A-Za-z]{1,2}[\d]{1,2}[A-Za-z]{0,1}\s*[\d]`
 * - Parcelforce - UK tracking code      `^([A-z]{2}\d{7})|([A-z]{4}\d{10})$`
 * - TestDetails Parcelforce - International tracking of exports   `^([A-z]{2}\d{9}[Gg][Bb])|(\d{12})$`
 * - Parcelforce - International tracking of imports               `^[A-z]{2}\d{9}(?![Gg][Bb])[A-z]{2}$`
 * - Parcelforce - All Tracking Codes    `^(?<ParcelForceUK>(?:[A-z]{2}\d{7})|(?:[A-z]{4}\d{10}))$|^(?<ParcelForceExport>(?:[A-z]{2}\d{9}[Gg][Bb])|(?:\d{12}))$|^(?<ParcelForceImport>[A-z]{2}\d{9}(?![Gg][Bb])[A-z]{2})$`
 * - TNT UK Delivery Tracking Code       `^(?:[A-z]{2})?\d{9}(?:[A-z]{2})?$`
 * - UPS - United States format          `^(?:1[Zz])(?<ShipperNumber>[A-z\d]{6})(?<ServiceCode>[A-z\d]{2})(?<PackageId>\d{8})$`
 * - UPS - UK format                     `^((1[Zz]\d{16})|(\d{12})|([Tt]\d{10})|(\d{9}))$`
 * - S10 (UPU Standard) Parcel Tracking Code        `^(?<ServiceCode>[A-z]{2})(?<ParcelNumber>\d{8})(?<CheckDigit>\d{1})(?<IsoCountryCode>[A-z]{2})$`
 */
export function validation(){
	let result = '';
	const serviceCode = {
				"AV-AZ": {desc: 'domestic, bilateral, multilateral use only, identifying RFID-tracked e-commerce items', codes: []},
				"BA-BZ": {desc: 'for domestic, bilateral, multilateral use only', codes: []},
				"CA-CZ": {desc: 'Parcel post; the use of CZ requires bilateral agreement. It is not required to use CV for insured parcels but if the service indicator CV is used, then it is recommended that it be used only on insured parcels.', ru:'международная посылка (более 2 кг)', codes: []},
				"DA-DZ": {desc: 'for domestic, bilateral, multilateral use only', codes: []},
				"EA-EZ": {desc: 'EMS; the use of EX–EZ requires bilateral agreement', ru: 'экспресс-отправления (EMS)', codes: []},
				"GA": {desc: 'for domestic, bilateral, multilateral use only', codes: []},
				"GD": {desc: 'for domestic, bilateral, multilateral use only', codes: []},
				"HA-HZ": {desc: 'e-commerce parcels; the use of HX–HY requires multilateral agreement; the use of HZ requires bilateral agreement', codes: []},
				"JA-JZ": {use: false, desc: 'reserved; cannot be assigned as valid service indicator values', codes: []},
				"KA-KZ": {use: false, desc: 'reserved; cannot be assigned as valid service indicator values', codes: []},
				"LA-LZ": {desc: 'Letter post express; the use of LZ requires bilateral agreement',ru: 'нерегистрируемое отправление (исключение LM, LZ)', codes: []},
				"MA-MZ": {desc: 'Letter post: M bags', codes: []},
				"NA-NZ": {desc: 'for domestic, bilateral, multilateral use only', codes: []},
				"PA-PZ": {desc: 'for domestic, bilateral, multilateral use only', codes: []},
				"QA-QZ": {desc: 'Letter post: IBRS (International Business Reply Service)', codes: []},
				"RA-RZ": {desc: 'Letter post: registered, but not insured delivery. The use of RZ requires bilateral agreement.', ru: 'регистрируемое отправление письменной корреспонденции (заказная карточка, письмо, бандероль, мелкий пакет (до 2 кг), мешок М)', codes: []},
				"SA-SZ": {use: false, desc: 'reserved; cannot be assigned as valid service indicator values', codes: []},
				"TA-TZ": {use: false, desc: 'reserved; cannot be assigned as valid service indicator values', codes: []},
				"UA-UZ": {desc: 'Letter post: items other than LA–LZ (Express), MA–MZ (M bags), QA–QM (IBRS), RA–RZ (registered), VA–VZ (insured), subject to customs control, i.e. bearing a CN 22 or CN 23', ru: 'нерегистрируемые и неотслеживаемые отправления, но которые обязаны проходить таможенные процедуры', codes: []},
				"VA-VZ": {desc: 'Letter post insured; the use of VZ requires bilateral agreement', ru: 'письмо с объявленной ценностью', codes: []},
				"WA-WZ": {use: false, desc: 'reserved; cannot be assigned as valid service indicator values', codes: []},
				"ZA-ZZ": {desc: 'for domestic, bilateral, multilateral use only', ru: 'SRM-отправление (от simplified registered mail), простой регистрируемый пакет', codes: []}
			},

			/**
			 * Первые восемь цифр (12345678) — уникальный номер отправления. Согласно правилам UPU-S10, 
			 * почтовая служба должна назначать идентификаторы таким образом, 
			 * чтобы номер не повторялся в течение 12 календарных месяцев 
			 * (рекомендованный период — 24 календарных месяца или дольше).
			 * @type {number}
			 */
			parcelNumber = 0,
			/**
			 * Девятая цифра (9) — проверочный код, рассчитываемый по формуле[2];
			 * - каждая из первых восьми цифр номера умножается соответственно на 8, 6, 4, 2, 3, 5, 9, 7;
			 * - полученные значения суммируются;
			 * - результат делится на 11, чтобы получить остаток;
			 * - остаток вычитается из 11;
			 * - полученный результат является проверочным кодом, если он больше или равен 1, но меньше или равен 9;
			 * - если результат равен 10, то проверочный код равен 0;
			 * - если результат равен 11, то проверочный код равен 5.
			 * @type {number}
			 */
			crc = 0,
			/**
			 * Две буквы в конце (YY) — буквенный код страны-отправителя 
			 * (например, US — США, GB — Великобритания, FR — Франция, RU — Россия, UA — Украина, CN — Китай, 
			 * IL — Израиль и т. д.), 
			 * или код почтовой службы (например, YP — Yanwen Logistics).
			 * Идентификатор внутреннего почтового отправления обычно состоит из 13 символов (внутрироссийский состоит из 14 цифр).
			 * @type {number}
			 */
			isoCountryCode = 0,

			regChecking = /^(?<serviceCode>[A-z]{2})(?<parcelNumber>\d{8})(?<crc>\d{1})(?<isoCountryCode>[A-z]{2})$/i;
	
			/*
			Внутрироссийский почтовый идентификатор содержит 14 цифр и состоит из четырёх смысловых частей:
				
				1. Первые 6 цифр — индекс предприятия связи места приёма.
				
				2. Седьмая и восьмая цифры — порядковый номер месяца печати штрихкодового идентификатора, начиная с 01.2000 (значение 01), это обеспечивает уникальность идентификатора в сети почтовой связи в течение, по крайней мере, восьми лет. При достижении номера 99 следующий месяц получает номер 01.
				
				3. Пять цифр с девятой по тринадцатую — уникальный номер почтового отправления, принятого в предприятии связи в текущем месяце.
				
				4. Последняя, четырнадцатая цифра — контрольный разряд, который вычисляется по следующему правилу:
				
				Сумма цифр в нечётных позициях умножается на 3;
				Суммируются все цифры в чётных позициях;
				Суммируются результаты действий пунктов 1 и 2;
				Из 10 вычитается остаток от деления суммы из пункта 3 на 10. Это число и есть контрольный разряд. (В случае, если результат пункта 4 кратен 10, то контрольный разряд равен 0).
			 */
	
	return result;
}
