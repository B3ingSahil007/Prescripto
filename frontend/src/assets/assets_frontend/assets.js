import appointment_img from './appointment_img.png'
import header_img from './header_img.png'
import group_profiles from './group_profiles.png'
import profile_pic from './profile_pic.png'
import contact_image from './contact_image.png'
import about_image from './about_image.png'
import logo from './logo.svg'
import dropdown_icon from './dropdown_icon.svg'
import menu_icon from './menu_icon.svg'
import cross_icon from './cross_icon.png'
import chats_icon from './chats_icon.svg'
import verified_icon from './verified_icon.svg'
import arrow_icon from './arrow_icon.svg'
import info_icon from './info_icon.svg'
import upload_icon from './upload_icon.png'
import stripe_logo from './stripe_logo.png'
import razorpay_logo from './razorpay_logo.png'
import doc1 from './doc1.png'
import doc2 from './doc2.png'
import doc3 from './doc3.png'
import doc4 from './doc4.png'
import doc5 from './doc5.png'
import doc6 from './doc6.png'
import doc7 from './doc7.png'
import doc8 from './doc8.png'
import doc9 from './doc9.png'
import doc10 from './doc10.png'
import doc11 from './doc11.png'
import doc12 from './doc12.png'
import doc13 from './doc13.png'
import doc14 from './doc14.png'
import doc15 from './doc15.png'
import Dermatologist from './Dermatologist.svg'
import Gastroenterologist from './Gastroenterologist.svg'
import General_physician from './General_physician.svg'
import Gynecologist from './Gynecologist.svg'
import Neurologist from './Neurologist.svg'
import Pediatricians from './Pediatricians.svg'


export const assets = {
    appointment_img,
    header_img,
    group_profiles,
    logo,
    chats_icon,
    verified_icon,
    info_icon,
    profile_pic,
    arrow_icon,
    contact_image,
    about_image,
    menu_icon,
    cross_icon,
    dropdown_icon,
    upload_icon,
    stripe_logo,
    razorpay_logo
}

export const specialityData = [
    {
        speciality: 'General Physician',
        image: General_physician
    },
    {
        speciality: 'Gynecologist',
        image: Gynecologist
    },
    {
        speciality: 'Dermatologist',
        image: Dermatologist
    },
    {
        speciality: 'Pediatricians',
        image: Pediatricians
    },
    {
        speciality: 'Neurologist',
        image: Neurologist
    },
    {
        speciality: 'Gastroenterologist',
        image: Gastroenterologist
    },
]

export const doctors = [
    {
        _id: 'Dr.RichardJames',
        name: 'Dr. Richard James',
        image: doc1,
        speciality: 'GeneralPhysician',
        degree: 'MD in Internal Medicine',
        experience: '8 Years',
        about: 'Dr. James specializes in adult medicine and provides comprehensive care for common illnesses and chronic conditions. He believes in building long-term relationships with patients and focuses on preventive healthcare.',
        fees: 6225,
        address: {
            line1: '123 Health Plaza',
            line2: 'Suite 201, Boston, MA 02115'
        }
    },
    {
        _id: 'Dr.EmilyLarson',
        name: 'Dr. Emily Larson',
        image: doc2,
        speciality: 'Gynecologist',
        degree: 'MD in Obstetrics & Gynecology',
        experience: '12 Years',
        about: 'Dr. Larson provides compassionate care for women at all stages of life. She specializes in minimally invasive gynecologic surgery and high-risk pregnancies, with a focus on patient education.',
        fees: 9960,
        address: {
            line1: '450 Women\'s Health Center',
            line2: 'Floor 3, Chicago, IL 60601'
        }
    },
    {
        _id: 'Dr.AryanShah',
        name: 'Dr. Aryan Shah',
        image: doc3,
        speciality: 'Dermatologist',
        degree: 'MD in Dermatology',
        experience: '5 Years',
        about: 'Dr. Shah is board-certified in medical and cosmetic dermatology. He specializes in skin cancer prevention, acne treatments, and anti-aging procedures using the latest technologies.',
        fees: 7885,
        address: {
            line1: '789 Skin Care Center',
            line2: 'Unit B, San Francisco, CA 94102'
        }
    },
    {
        _id: 'Dr.ChristopherLee',
        name: 'Dr. Christopher Lee',
        image: doc4,
        speciality: 'Pediatricians',
        degree: 'MD in Pediatrics',
        experience: '15 Years',
        about: 'Dr. Lee is dedicated to children\'s health from birth through adolescence. He provides well-child care, immunizations, and treatment for childhood illnesses in a child-friendly environment.',
        fees: 7055,
        address: {
            line1: '321 Children\'s Hospital',
            line2: 'Pediatrics Wing, New York, NY 10001'
        }
    },
    {
        _id: 'Dr.JenniferGarcia',
        name: 'Dr. Jennifer Garcia',
        image: doc5,
        speciality: 'Neurologist',
        degree: 'MD in Neurology, PhD in Neuroscience',
        experience: '10 Years',
        about: 'Dr. Garcia specializes in treating complex neurological disorders including epilepsy, migraines, and neurodegenerative diseases. She combines clinical expertise with cutting-edge research.',
        fees: 12450,
        address: {
            line1: '654 Neuro Center',
            line2: 'Suite 500, Houston, TX 77030'
        }
    },
    {
        _id: 'Dr.AndrewWilliams',
        name: 'Dr. Andrew Williams',
        image: doc6,
        speciality: 'Neurologist',
        degree: 'MD in Neurology',
        experience: '7 Years',
        about: 'Dr. Williams focuses on movement disorders and neuromuscular diseases. He provides comprehensive care for Parkinson\'s disease, multiple sclerosis, and peripheral nerve disorders.',
        fees: 10790,
        address: {
            line1: '987 Brain & Spine Institute',
            line2: 'Floor 2, Philadelphia, PA 19102'
        }
    },
    {
        _id: 'Dr.ChristopherDavis',
        name: 'Dr. Christopher Davis',
        image: doc7,
        speciality: 'GeneralPhysician',
        degree: 'DO in Family Medicine',
        experience: '20 Years',
        about: 'Dr. Davis provides whole-person healthcare for individuals and families. His holistic approach combines traditional medicine with lifestyle counseling for optimal wellness.',
        fees: 7470,
        address: {
            line1: '234 Family Practice',
            line2: 'Building A, Seattle, WA 98101'
        }
    },
    {
        _id: 'Dr.TimothyWhite',
        name: 'Dr. Timothy White',
        image: doc8,
        speciality: 'Gynecologist',
        degree: 'MD in Reproductive Endocrinology',
        experience: '18 Years',
        about: 'Dr. White specializes in fertility treatments and reproductive health. He offers advanced solutions for infertility, hormonal disorders, and menopause management.',
        fees: 14940,
        address: {
            line1: '567 Fertility Center',
            line2: 'Suite 300, Atlanta, GA 30303'
        }
    },
    {
        _id: 'Dr.AvaMitchell',
        name: 'Dr. Ava Mitchell',
        image: doc9,
        speciality: 'Gynecologist',
        degree: 'MD in Obstetrics & Gynecology, Reproductive Endocrinology Fellowship',
        experience: '9 Years',
        about: 'Dr. Mitchell is a board-certified gynecologist specializing in hormonal disorders and reproductive health. She provides compassionate care for women at all life stages, with expertise in minimally invasive surgical techniques and fertility preservation.',
        fees: 13280,
        address: {
            line1: '890 Women\'s Health Pavilion',
            line2: 'Floor 4, Miami, FL 33101'
        }
    },
    {
        _id: 'Dr.JeffreyKing',
        name: 'Dr. Jeffrey King',
        image: doc10,
        speciality: 'Pediatricians',
        degree: 'MD in Pediatric Emergency Medicine',
        experience: '9 Years',
        about: 'Dr. King specializes in urgent pediatric care and childhood injury prevention. He provides compassionate emergency services and follow-up care for young patients.',
        fees: 8300,
        address: {
            line1: '432 Children\'s Emergency',
            line2: 'Building C, Los Angeles, CA 90012'
        }
    },
    {
        _id: 'Dr.ZoeKelly',
        name: 'Dr. Zoe Kelly',
        image: doc11,
        speciality: 'Neurologist',
        degree: 'MD in Neurology, Stroke Specialist',
        experience: '11 Years',
        about: 'Dr. Kelly leads the stroke prevention program and specializes in cerebrovascular diseases. She implements advanced treatments for stroke recovery and prevention.',
        fees: 13280,
        address: {
            line1: '765 Neurovascular Institute',
            line2: 'Suite 700, Dallas, TX 75201'
        }
    },
    {
        _id: 'Dr.PatrickHarris',
        name: 'Dr. Patrick Harris',
        image: doc12,
        speciality: 'Gastroenterologist',
        degree: 'MD in Gastroenterology, Advanced Endoscopy Fellowship',
        experience: '14 Years',
        about: 'Dr. Harris specializes in digestive health, liver diseases, and advanced endoscopic procedures. He leads a state-of-the-art endoscopy unit, providing minimally invasive treatments for conditions like GERD, IBD, and pancreatic disorders. He is actively involved in research on innovative GI therapies.',
        fees: 14940,
        address: {
            line1: '109 Digestive Health Center',
            line2: 'Floor 5, Denver, CO 80202'
        }
    },
    {
        _id: 'Dr.ChloeEvans',
        name: 'Dr. Chloe Evans',
        image: doc13,
        speciality: 'GeneralPhysician',
        degree: 'MD in Geriatric Medicine',
        experience: '13 Years',
        about: 'Dr. Evans specializes in care for older adults, managing multiple chronic conditions and promoting healthy aging. She focuses on maintaining independence and quality of life.',
        fees: 7055,
        address: {
            line1: '876 Senior Care Center',
            line2: 'Suite 150, Phoenix, AZ 85001'
        }
    },
    {
        _id: 'Dr.RyanMartinez',
        name: 'Dr. Ryan Martinez',
        image: doc14,
        speciality: 'Dermatologist',
        degree: 'MD in Dermatology, Mohs Surgery Fellowship',
        experience: '12 Years',
        about: 'Dr. Martinez is a fellowship-trained dermatologic surgeon specializing in skin cancer treatment and reconstruction. He combines precision surgical skills with aesthetic expertise to achieve optimal functional and cosmetic results for patients.',
        fees: 15355,
        address: {
            line1: '543 Skin Cancer Center',
            line2: 'Floor 6, Washington, DC 20001'
        }
    },
    {
        _id: 'Dr.AmeliaHill',
        name: 'Dr. Amelia Hill',
        image: doc15,
        speciality: 'Dermatologist',
        degree: 'MD in Pediatric Dermatology',
        experience: '8 Years',
        about: 'Dr. Hill specializes in skin conditions affecting children and adolescents. She provides gentle, effective treatments for eczema, birthmarks, and genetic skin disorders.',
        fees: 8715,
        address: {
            line1: '210 Pediatric Skin Clinic',
            line2: 'Suite 250, Minneapolis, MN 55401'
        }
    }
]