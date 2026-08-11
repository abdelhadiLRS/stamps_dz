// Helper module to load and merge Arabic and English stamp data seamlessly.
// This is to be embedded or loaded by index.html and details.html.

async function loadAndMergeStampsData() {
    try {
        const [resAr, resEn] = await Promise.all([
            fetch('./stamps_data.json'),
            fetch('./stamps_data_en.json')
        ]);

        const dataAr = await resAr.json();
        const dataEn = await resEn.json();

        // Create map for English data to merge with Arabic
        const enMap = new Map();
        dataEn.forEach(item => {
            enMap.set(item.id, item);
        });

        // Merge them
        const merged = dataAr.map(item => {
            const enItem = enMap.get(item.id) || {};
            return {
                id: item.id,
                page_number: item.page_number || enItem.page_number,

                // Arabic properties
                title_ar: item.title_ar,
                description_ar: item.description_ar,
                details_ar: item.details || {},

                // English properties
                theme_en: enItem.theme_en || (item.details ? item.details.theme_en : ''),
                value_en: enItem.value,
                issue_date_en: enItem.issue_date,
                dimensions_en: enItem.dimensions,
                designer_en: enItem.designer,
                printer_en: enItem.printer,
                perforation_en: enItem.perforation,
                raw_text_en: enItem.raw_text,

                // Common/Combined
                image_path: item.image_path || enItem.image_path,

                // Fallbacks/Helper properties
                get title() {
                    return currentLang === 'ar' ? (this.title_ar || this.theme_en) : (this.theme_en || this.title_ar);
                },
                get value() {
                    if (currentLang === 'ar') {
                        return this.details_ar.value || this.value_en;
                    } else {
                        return this.value_en || this.details_ar.value;
                    }
                },
                get designer() {
                    if (currentLang === 'ar') {
                        return this.details_ar.designer || this.designer_en;
                    } else {
                        return this.designer_en || this.details_ar.designer;
                    }
                },
                get printer() {
                    if (currentLang === 'ar') {
                        return this.details_ar.printer || this.printer_en;
                    } else {
                        return this.printer_en || this.details_ar.printer;
                    }
                },
                get issue_date() {
                    if (currentLang === 'ar') {
                        return this.details_ar.issue_date || this.issue_date_en;
                    } else {
                        return this.issue_date_en || this.details_ar.issue_date;
                    }
                },
                get dimensions() {
                    if (currentLang === 'ar') {
                        return this.details_ar.dimensions || this.dimensions_en;
                    } else {
                        return this.dimensions_en || this.details_ar.dimensions;
                    }
                },
                get perforation() {
                    if (currentLang === 'ar') {
                        return this.details_ar.perforation || this.perforation_en;
                    } else {
                        return this.perforation_en || this.details_ar.perforation;
                    }
                },
                get withdrawal_date() {
                    return this.details_ar.withdrawal_date || '';
                },
                get description() {
                    return currentLang === 'ar' ? this.description_ar : (this.raw_text_en || this.description_ar);
                }
            };
        });

        return merged;
    } catch (err) {
        console.error('Error loading or merging stamps data:', err);
        throw err;
    }
}
