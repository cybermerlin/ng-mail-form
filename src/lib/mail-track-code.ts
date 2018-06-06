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
export function validation(v) {
	let result = 0;
	const serviceCode = {
		"AV-AZ": {
			reg: /A[V-Z]/,
			desc: "domestic, bilateral, multilateral use only, identifying RFID-tracked e-commerce items",
			codes: []
		},
		"BA-BZ": {reg: /B[A-Z]/, desc: "for domestic, bilateral, multilateral use only", codes: []},
		"CA-CZ": {
			reg: /C[A-Z]/,
			desc: "Parcel post; the use of CZ requires bilateral agreement. It is not required to use CV for insured parcels but if the service indicator CV is used, then it is recommended that it be used only on insured parcels.",
			ru: "международная посылка (более 2 кг)",
			codes: []
		},
		"DA-DZ": {reg: /D[A-Z]/, desc: "for domestic, bilateral, multilateral use only", codes: []},
		"EA-EZ": {
			reg: /E[A-Z]/,
			desc: "EMS; the use of EX–EZ requires bilateral agreement",
			ru: "экспресс-отправления (EMS)",
			codes: []
		},
		"GA": {reg: /GA/, desc: "for domestic, bilateral, multilateral use only", codes: []},
		"GD": {reg: /GD/, desc: "for domestic, bilateral, multilateral use only", codes: []},
		"HA-HZ": {
			reg: /H[A-Z]/,
			desc: "e-commerce parcels; the use of HX–HY requires multilateral agreement; the use of HZ requires bilateral agreement",
			codes: []
		},
		"JA-JZ": {use: false, desc: "reserved; cannot be assigned as valid service indicator values", codes: []},
		"KA-KZ": {use: false, desc: "reserved; cannot be assigned as valid service indicator values", codes: []},
		"LA-LZ": {
			reg: /L[A-Z]/,
			desc: "Letter post express; the use of LZ requires bilateral agreement",
			ru: "нерегистрируемое отправление (исключение LM, LZ)",
			codes: []
		},
		"MA-MZ": {reg: /M[A-Z]/, desc: "Letter post: M bags", codes: []},
		"NA-NZ": {reg: /N[A-Z]/, desc: "for domestic, bilateral, multilateral use only", codes: []},
		"PA-PZ": {reg: /P[A-Z]/, desc: "for domestic, bilateral, multilateral use only", codes: []},
		"QA-QZ": {reg: /Q[A-Z]/, desc: "Letter post: IBRS (International Business Reply Service)", codes: []},
		"RA-RZ": {
			reg: /R[A-Z]/,
			desc: "Letter post: registered, but not insured delivery. The use of RZ requires bilateral agreement.",
			ru: "регистрируемое отправление письменной корреспонденции (заказная карточка, письмо, бандероль, мелкий пакет (до 2 кг), мешок М)",
			codes: []
		},
		"SA-SZ": {use: false, desc: "reserved; cannot be assigned as valid service indicator values", codes: []},
		"TA-TZ": {use: false, desc: "reserved; cannot be assigned as valid service indicator values", codes: []},
		"UA-UZ": {
			reg: /U[A-Z]/,
			desc: "Letter post: items other than LA–LZ (Express), MA–MZ (M bags), QA–QM (IBRS), RA–RZ (registered), VA–VZ (insured), subject to customs control, i.e. bearing a CN 22 or CN 23",
			ru: "нерегистрируемые и неотслеживаемые отправления, но которые обязаны проходить таможенные процедуры",
			codes: []
		},
		"VA-VZ": {
			reg: /V[A-Z]/,
			desc: "Letter post insured; the use of VZ requires bilateral agreement",
			ru: "письмо с объявленной ценностью",
			codes: []
		},
		"WA-WZ": {use: false, desc: "reserved; cannot be assigned as valid service indicator values", codes: []},
		"ZA-ZZ": {
			reg: /Z[A-Z]/,
			desc: "for domestic, bilateral, multilateral use only",
			ru: "SRM-отправление (от simplified registered mail), простой регистрируемый пакет",
			codes: []
		}
	};

	/**
	 * Первые восемь цифр (12345678) — уникальный номер отправления. Согласно правилам UPU-S10,
	 * почтовая служба должна назначать идентификаторы таким образом,
	 * чтобы номер не повторялся в течение 12 календарных месяцев
	 * (рекомендованный период — 24 календарных месяца или дольше).
	 * @type {number}
	 */
	let parcelNumber = v.substr(2, 8),
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

			regChecking = /^([A-Z]{2})(\d{8})(\d)([A-z]{2})$/;

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

	// serviceCode
	for (let i in serviceCode) {
		if (!serviceCode.hasOwnProperty(i)) continue;
		result |= serviceCode[i].use !== false && serviceCode[i].reg.test(v[0] + v[1]);
		if (!!result) break;
	}
	result &= +regChecking.test(v);

	// parcelNumber + crc
	const pnS = [8, 6, 4, 2, 3, 5, 9, 7];
	crc = +Array.from(parcelNumber).reduce(function(r: number, c: number, i) {return r + c * pnS[i]}, 0);
	crc = 11 - (crc - Math.floor(crc / 11) * 11);
	result &= +(v.substr(-3, 1) == ((crc >= 1 || crc <= 9)
			? crc
			: (
					crc === 10
							? 0
							: (crc === 11)? 5: crc
			)));

	//TODO: find list of country codes AND postal services
	// result &= v.substr(-2) in isoCountryCode
	return !!result;
}
