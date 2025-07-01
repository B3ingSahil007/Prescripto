import { useContext } from "react";
import { useState } from "react";
import { FaFileUpload } from "react-icons/fa";
import { AdminContext } from "../context/AdminContext";
import { toast } from "react-toastify";
import axios from "axios";

const AddDoctor = () => {
    const [docImg, setDocImg] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [experience, setExperience] = useState('');
    const [fees, setFees] = useState('');
    const [about, setAbout] = useState('');
    const [speciality, setSpeciality] = useState('');
    const [degree, setDegree] = useState('');
    const [address1, setAddress1] = useState('');
    const [address2, setAddress2] = useState('');
    const [loading, setLoading] = useState(false);

    const { backendUrl, adminToken } = useContext(AdminContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (!docImg) {
                return toast.error('Please Upload Doctor Image');
            }
            const formData = new FormData()
            formData.append('docImg', docImg);
            formData.append('name', name);
            formData.append('email', email);
            formData.append('password', password);
            formData.append('experience', experience);
            formData.append('fees', Number(fees));
            formData.append('about', about);
            formData.append('speciality', speciality);
            formData.append('degree', degree);
            formData.append('address1', JSON.stringify({ line1: address1, line2: address2 }));

            // In your handleSubmit function, update the headers:
            const { data } = await axios.post(`${backendUrl}/api/admin/add-doctor`, formData, {
                headers: {
                    'Authorization': `Bearer ${adminToken}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (data.success) {
                toast.success(data.message);
                setDocImg(false);
                setName('');
                setEmail('');
                setPassword('');
                setExperience('');
                setFees('');
                setAbout('');
                setSpeciality('');
                setDegree('');
                setAddress1('');
                setAddress2('');
            } else {
                toast.error(data.message);
                console.error(data.message);
            }

        } catch (error) {
            console.error(error);
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="w-full m-5">
            <h2 className="text-xl font-medium mb-3">Add Doctors</h2>
            <form onSubmit={handleSubmit} className="px-8 py-8 border border-blue-300 rounded-lg w-full  max-h-[80vh] overflow-y-scroll">
                {/* Image Upload */}
                <div className="w-96 flex flex-col items-center justify-center border-2 border-dashed border-blue-300 rounded-lg p-2 mb-6">
                    {docImg ?
                        <img className="w-40 h-40 object-cover" src={URL.createObjectURL(docImg)} alt="Doctor_Image" />
                        :
                        <label htmlFor="doc-img" className="cursor-pointer flex flex-col items-center">
                            <FaFileUpload className="text-4xl text-blue-500 mb-2" />
                            <span className="text-gray-600 font-medium">Upload Doctor Image</span>
                        </label>}
                    <input onChange={(e) => setDocImg(e.target.files[0])} type="file" id="doc-img" className="hidden" />
                </div>

                {/* Grid Layout for Input Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Doctor Name */}
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                            Doctor Name
                        </label>
                        <input onChange={(e) => setName(e.target.value)} value={name} type="text" id="name" className="w-full px-4 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter doctor's full name" />
                    </div>

                    {/* Specialty */}
                    <div>
                        <label htmlFor="specialty" className="block text-sm font-medium text-gray-700 mb-1">
                            Specialty
                        </label>
                        <select
                            id="specialty"
                            className="w-full px-4 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            defaultValue=""
                            onChange={(e) => setSpeciality(e.target.value)}
                            value={speciality}
                        >
                            <option value="" disabled>Select specialty</option>
                            <option value="GeneralPhysician">General Physician</option>
                            <option value="Gynecologist">Gynecologist</option>
                            <option value="Dermatologist">Dermatologist</option>
                            <option value="Pediatricians">Pediatricians</option>
                            <option value="Neurologist">Neurologist</option>
                            <option value="Gastroenterologist">Gastroenterologist</option>
                        </select>
                    </div>


                    {/* Doctor Email */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                            Doctor Email
                        </label>
                        <input onChange={(e) => setEmail(e.target.value)} value={email} type="email" id="email" className="w-full px-4 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter doctor's email" />
                    </div>

                    {/* Education */}
                    <div>
                        <label htmlFor="education" className="block text-sm font-medium text-gray-700 mb-1">
                            Education
                        </label>
                        <input onChange={(e) => setDegree(e.target.value)} value={degree} type="text" id="education" className="w-full px-4 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Doctor's qualifications" />
                    </div>

                    {/* Doctor Password */}
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                            Doctor Password
                        </label>
                        <input onChange={(e) => setPassword(e.target.value)} value={password} type="password" id="password" className="w-full px-4 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Create a password" />
                    </div>

                    {/* Address 1 */}
                    <div>
                        <label htmlFor="address1" className="block text-sm font-medium text-gray-700 mb-1">
                            Address
                        </label>
                        <div className="flex flex-col gap-2">
                            <input onChange={(e) => setAddress1(e.target.value)} value={address1} type="text" id="address1" className="w-full px-4 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Street address, P.O. box" />
                            <input onChange={(e) => setAddress2(e.target.value)} value={address2} type="text" id="address2" className="w-full px-4 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Apartment, suite, unit, building, floor" />
                        </div>
                    </div>

                    {/* Experience */}
                    <div>
                        <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-1">
                            Experience (years)
                        </label>
                        <input onChange={(e) => setExperience(e.target.value)} value={experience} type="number" id="experience" className="w-full px-4 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Years of experience" />
                    </div>

                    {/* Fees */}
                    <div>
                        <label htmlFor="fees" className="block text-sm font-medium text-gray-700 mb-1">
                            Consultation Fees
                        </label>
                        <input onChange={(e) => setFees(e.target.value)} value={fees} type="number" id="fees" className="w-full px-4 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter consultation fees" />
                    </div>


                </div>

                {/* About Me */}
                <div className="mt-6">
                    <label htmlFor="about" className="block text-sm font-medium text-gray-700 mb-1">
                        About Me
                    </label>
                    <textarea onChange={(e) => setAbout(e.target.value)} value={about} id="about" rows={4} className="w-full px-4 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Tell us about the doctor's background, expertise, etc." ></textarea>
                </div>

                {/* Submit Button */}
                <div className="flex justify-start mt-8">
                    <button type="submit" className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700" >
                        {loading ? (
                            <span className="flex items-center gap-2">
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" >
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" ></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" ></path>
                                </svg>
                                Processing...
                            </span>
                        ) : (
                            "Add Doctor"
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddDoctor;