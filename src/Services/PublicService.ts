// src/services/PublicService.ts

export const PublicService = {
    /* ===========================
     HOME PAGE (NEW)
     =========================== */
    home: {
        hero: {
            badge: "✨ Celebrating 50 Years of Service",

            title: {
                line1: "Supporting Our",
                highlight: "Bank Family",
                line3: "For 50 Years",
            },

            description:
                "A Unit of Canara Bank Employees' Union, dedicated to the welfare of our members and their families through the Golden Jubilee Family Welfare Scheme.",

            buttons: {
                primary: {
                    label: "Become a Member",
                    route: "/membership",
                },
                secondary: {
                    label: "Learn More",
                    route: "/about",
                },
            },

            image: {
                alt: "Happy retired bank employees celebrating together",
            },
        },

        features: {
            heading: {
                label: "Our Commitment",
                title: "Why Join Our Scheme?",
                subtitle:
                    "For five decades, we have been providing essential support to bank employees and their families.",
            },

            items: [
                {
                    icon: "FaHeart",
                    title: "Family Support",
                    description:
                        "Providing financial assistance to families of deceased members with compassion and care.",
                },
                {
                    icon: "FaShieldAlt",
                    title: "Secure Benefits",
                    description:
                        "Lumpsum relief up to Rs. 1,00,000 and monthly pension of Rs. 1,250 for eligible nominees.",
                },
                {
                    icon: "FaUsers",
                    title: "Strong Community",
                    description:
                        "A noble mission connecting members across Kerala, extending help to families in need.",
                },
                {
                    icon: "FaAward",
                    title: "50 Years Legacy",
                    description:
                        "Trusted welfare scheme established in 1962, serving retired bank employees with dedication.",
                },
            ],
        },

        aboutus: {
            label: "Our History",
            title: "A Legacy of Care & Support",

            paragraphs: {
                paragraph1:
                    "The Scheme was launched at Thiruvananthapuram on December 18, 1962 by the tThe Scheme was launched at Thiruvananthapuram on December 18, 1962 by the then General Secretary of Canara Bank Employees' Union Com A N Balasubramaniam, as per the decision taken at the 21st Conference held at Chennai from 5th to 8th January 1962.",
                paragraph2:
                    "The Rules and Regulations for the Scheme were formulated by the Central Committee held at Goa on 29th and 30th June 2012. The seeds for such a glorious Scheme were sown in the soil of Kerala very much earlier and crystallised with comrades from Galls providing actuarial inputs.",
                paragraph3:
                    "The Scheme was launched with a humble refundable contribution of Rs. 50/- per month per member and was initially providing a lumpsum relief of Rs. 30,000/- to the nominee of a deceased member. Over the years, the lumpsum relief has been enhanced to the present level of Rs. 1,00,000/-.",
                paragraph4:
                    "The Scheme also gives monthly pension of upto Rs. 1,250/- to such eligible nominees.The present monthly contribution is Rs. 200/- per member per month and is fully refundable at the time of retirement of the member..",
            },

            stats: [
                { value: "50+", label: "Years of Service", variant: "primary" },
                { value: "1L+", label: "Lumpsum Relief", variant: "secondary" },
                { value: "₹200", label: "Monthly Contribution", variant: "primary" },
                { value: "₹1250", label: "Monthly Pension", variant: "secondary" },
            ],
        },

        news: {
            heading: {
                label: "Stay Informed",
                title: "Latest News & Updates",
            },

            items: [
                {
                    date: "December 2025",
                    title: "Mass Organizations takes out marches to Parliament",
                    excerpt:
                        "Including AIBEA on Trade Union rights, minimum wages, commodities, corruption at high places etc. 2000 - BMs",
                },
                {
                    date: "November 2025",
                    title: "Annual General Meeting Announced",
                    excerpt:
                        "All members are invited to attend the upcoming AGM scheduled for next month in Thiruvananthapuram.",
                },
                {
                    date: "October 2025",
                    title: "Claims Settlement Update",
                    excerpt:
                        "Over 200 claims successfully processed this quarter, benefiting families across Kerala.",
                },
            ],

            sidebar: {
                quoteTitle: "Every Day is an AIBEA Day",
                quoteText:
                    "We salute all the members of the Scheme who have joined in a noble task of extending a helping hand to the families of our deceased colleagues.",

                heading: "Quick Links",

                quickLinks: [
                    { label: "Download Forms", href: "#downloads" },
                    { label: "View Claims Status", href: "#claims" },
                    { label: "Rules & Regulations", href: "#rules" },
                    { label: "Managing Committee", href: "#committee" },
                ],
            },
        },
    },

    /* ===========================
       ABOUT PAGE (NEW)
       =========================== */
    about: {
        header: {
            title: "About Us",
            subtitle: "50 years of dedicated service to bank employees and their families",
        },

        mission: {
            title: "Our Mission",
            icon: "bi bi-heart-fill",
            description:
                "To extend a helping hand to the families of our deceased colleagues by providing financial assistance through lumpsum relief and monthly pension, ensuring their welfare and dignity during difficult times.",
        },

        vision: {
            title: "Our Vision",
            icon: "bi bi-bullseye",
            description:
                "To create a strong community of bank employees united in their commitment to support one another, ensuring that no family is left without support in their hour of need.",
        },

        history: {
            title: "Our History",
            icon: "bi bi-clock-history",
            paragraphs: 
               {
                paragraph1: "The Scheme was launched at Thiruvananthapuram on December 18, 2002 by the then General Secretary of Canara Bank Employees’ Union Com A N Balasubramanian…",

                paragraph2:" The Rules and Regulations for the Scheme were formulated by the Central Committee held at Goa on 29th and 30th June 2002…",

                paragraph3:" The Scheme was launched with a humble refundable contribution of Rs. 50/- per month…",

               paragraph4: "The Scheme also gives monthly pension of upto Rs. 1250/-…",

                paragraph5:"  We salute all the members of the Scheme who have joined in this noble task…",
            }
            ,
            footerNote: "News Update",
        },
    },

    /* ===========================
    RULES & REGULATIONS (NEW)
    =========================== */
    rules: {
        header: {
            title: "Rules & Regulations",
            subtitle:
                "Complete guidelines for the Golden Jubilee Family Welfare Scheme",
        },

        preamble: {
            title: "Preamble",
            paragraphs: 
               { paragraph1:"WHEREAS the General Body Meeting of Canara Bank Employee’s Union (Regd),(hereinafter referred to as the “Union”), at its 21st Conference held at Chennai from 5th to 8th January 2002 had resolved unanimously to constitute a Scheme, to provide financial assistance to the family of deceased members of Scheme, and",

                paragraph2:"WHEREAS the said General Body Meeting had approved the salient features of the said Scheme, and",

                paragraph3:" WHEREAS for the proper administration of the scheme, it is necessary to frame Rules and Regulations to govern and regulate the operation of the Scheme and the disbursement of relief to the beneficiaries and matters connected therewith, and",

                paragraph4:"WHEREAS the General Body Meeting of Canara Bank Employee’s Union, at its 22nd Conference held at Hyderabad from 4th to 7th March 2006 had resolved unanimously to improve the existing financial assistance to the family of deceased members of Scheme, by increasing the subscription with effect from January 1, 2007, and",

                paragraph5:"WHEREAS the said General Body Meeting had approved the modifications to the salient features of the said Scheme,",
               
                paragraph6:"NOW THEREFORE in pursuance of the aforesaid objectives, the following Rules and Regulations are framed:"
            }
            ,
        },

        sections: [
            {
                number: 1,
                title: "Name of the Scheme",
                content: [
                    "Name of the fund shall be “Canara Bank Employees’ Union Golden Jubilee Family Welfare Scheme - a unit of Canara Bank Employees Union”, which in the following Rules and Regulations, is referred to as the “Scheme”.",
                ],
            },
            {
                number: 2,
                title: "Objects",
                list: [
                    "To provide financial assistance to the family/dependents of deceased members in times of distress.",
                    "To raise/acquire money by subscription or donations.",
                    "To provide financial aid or loans to members.",
                    "To adopt measures for the welfare of members as needed.",
                ],
            },
            {
                number: 3,
                title: "Management",
                content: [
                    "Scheme will be under the direct control of Canara Bank Employees’ Union (Regd.) having its central office at Chennai and managed by a Committee nominated by the Central Committee (CC) of the Union.",
                ],
            },
            {
                number: 4,
                title: "Managing Committee",
                list: [
                    "President – General Secretary of Union (Ex Officio)",
                    "Secretary – Nominated by CC",
                    "Treasurer – Nominated by CC",
                    "Four other members – Nominated by CC",
                ],
                footer:
                    "The Committee shall meet once every six months or more if necessary. Decisions are taken by majority.",
            },
            {
                number: 5,
                title: "Quorum",
                content: ["The quorum for a meeting shall be four."],
            },
            {
                number: 6,
                title: "President",
                content: [
                    "The President will preside over meetings and may take emergency measures subject to reporting to CC.",
                ],
            },
            {
                number: 7,
                title: "Secretary",
                content: [
                    "Responsible for correspondence, meetings, minutes, supervision of affairs, and duties assigned by committee.",
                ],
            },
            {
                number: 8,
                title: "Treasurer",
                content: [
                    "Maintains books, prepares annual balance sheet, and presents accounts for approval.",
                ],
            },
            {
                number: 9,
                title: "Administrative Office",
                content: [
                    "Located at “Balakrishna Menon Smarakam”, Ambujavilasam Road, Thiruvananthapuram - 695001.",
                ],
            },
            {
                number: 10,
                title: "Funds",
                content: [
                    "Administered by the Administrative Office under control of Managing Committee.",
                ],
            },
            {
                number: 11,
                title: "Accounts",
                content: [
                    "Scheme shall have its own bank account with Canara Bank.",
                ],
            },
            {
                number: 12,
                title: "Membership",
                content: [
                    "Membership open to employees of Canara Bank under age 58 who are Union members.",
                ],
            },
            {
                number: 13,
                title: "Subscription",
                content: [
                    "Rs. 50/month for old members; Rs. 100/month from 1 Jan 2007.",
                ],
            },
            {
                number: 14,
                title: "Cessation of Membership",
                list: [
                    "Non-payment",
                    "Resignation or expulsion",
                    "Leaving service",
                    "Completion of 15 years",
                ],
            },
            {
                number: 15,
                title: "Readmission",
                content: [
                    "Members may be readmitted upon payment of arrears, interest, and readmission fee.",
                ],
            },
            {
                number: 16,
                title: "Entitlement of Benefits",
                content: [
                    "Lump sum relief varies between Rs. 30,000 to Rs. 50,000 depending on subscription.",
                    "Monthly pension varies from Rs. 500 to Rs. 750 based on criteria.",
                ],
            },
            {
                number: 17,
                title: "Nomination",
                content: [
                    "Each member nominates up to three beneficiaries in order of precedence.",
                ],
            },
            {
                number: 18,
                title: "Distribution of Benefits",
                content: [
                    "Claims processed by Administrative Office after verification.",
                ],
            },
            {
                number: 19,
                title: "Representation",
                content: [
                    "Secretary is authorized to file or face legal proceedings.",
                ],
            },
            {
                number: 20,
                title: "Place of Suing",
                content: [
                    "Jurisdiction restricted to courts in Thiruvananthapuram.",
                ],
            },
            {
                number: 21,
                title: "Assets",
                content: [
                    "All properties vest with the Scheme under the Managing Committee.",
                ],
            },
            {
                number: 22,
                title: "Accounts (Audit)",
                content: [
                    "Accounts audited annually by Chartered Accountants.",
                ],
            },
            {
                number: 23,
                title: "Amendments",
                content: [
                    "Rules may be amended only by the Central Committee of the Union.",
                ],
            },
            {
                number: 24,
                title: "Dissolution",
                content: [
                    "Upon dissolution, funds are distributed proportionally to members.",
                ],
            },
        ],
    },

    /* ===========================
    DOWNLOADS (NEW)
    =========================== */
    downloads: {
        header: {
            title: "Downloads",
            subtitle:
                "Access all forms and documents related to the Golden Jubilee Family Welfare Scheme",
        },

        card: {
            title: "Download Files",
            icon: "bi-folder2-open",
        },

        files: [
            {
                title: "APPLICATION FOR MEMBERSHIP",
                description: "APPLICATION FOR MEMBERSHIP.",
                fileKey: "membership_application",
            },
            {
                title: "AUTHORITY LETTER",
                description: "LETTER AUTHORISING DEDUCTION OF SUBSCRIPTION.",
                fileKey: "authority_letter",
            },
            {
                title: "RECEIPT",
                description: "FORM TO ACKNOWLEDGE RECEIPT OF PAYMENT.",
                fileKey: "receipt_form",
            },
            {
                title: "CLAIM FORM",
                description: "FORM FOR SUBMITTING THE CLAIM.",
                fileKey: "claim_form",
            },
        ],

        footer: {
            supportButtonText: "Contact Support",
            supportRoute: "/contact",
        },
    },

    /* ===========================
    MANAGING COMMITTEE (NEW)
    =========================== */
    managingCommittee: {
        header: {
            title: "Managing Committee",
            subtitle:
                "Meet the dedicated team leading the Golden Jubilee Family Welfare Scheme",
        },

        members: [
            {
                name: "K SRIKRISHNA",
                role: "President",
                location: "Thiruvananthapuram",
                phone: "+91 98765 43210",
                email: "president@cbfws.org",
            },
            {
                name: "B Ramprakash",
                role: "General Secretary",
                location: "Kochi",
                phone: "+91 98765 43211",
                email: "secretary@cbfws.org",
            },
            {
                name: "Com. R S Indubhas",
                role: "Treasurer",
                location: "Kozhikode",
                phone: "+91 98765 43212",
                email: "treasurer@cbfws.org",
            },
            {
                name: "Com. Shamsher Singh",
                role: "Member",
                location: "Thrissur",
                phone: "+91 98765 43213",
                email: "jscommittee@cbfws.org",
            },
            {
                name: "Com. K. Vijayan",
                role: "Vice President",
                location: "Kollam",
                phone: "+91 98765 43214",
                email: "vpresident@cbfws.org",
            },
            {
                name: "Com. K. V. Ranga Rao",
                role: "Member",
                location: "Kannur",
                phone: "+91 98765 43215",
                email: "committee@cbfws.org",
            },
        ],
    },

};
