import React, { useEffect, useState, useRef, createRef } from "react";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle, faCircleInfo, faCircleNotch, faCirclePlus, faPenToSquare, faPencil, faXmarkCircle } from "@fortawesome/free-solid-svg-icons";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { AddOrUpdateText } from "../../../components/utils/Utils";
import { isEmptyOrSpaces } from "../../../components/utils/Utils";
import { generateSlug } from "../../../components/utils/Utils";

import { getHeritageById } from "services/HeritageRepository";
import { getHeritageTypes } from "services/HeritageTypeRepository";
import { getLocations } from "../../../services/LocationRepository";
import { getManagementUnits } from "../../../services/ManagementUnitRepository";
import { addHeritage } from "../../../services/HeritageRepository";
import { putHeritage } from "../../../services/HeritageRepository";
import NotificationModal from "../../../components/admin/modal/NotificationModal";

import DefaultImage from "images/post-default-full.png"
import { getHeritageCategories } from "../../../services/HeritageCategoryRepository";
import { getHeritageWithDetailById } from "../../../services/HeritageRepository";
import { addHeritageWithParagraphs } from "../../../services/HeritageRepository";
import { putHeritageWithParagraphs } from "../../../services/HeritageRepository";
import { splitImageUrls } from "../../../components/utils/Utils";

export default ({ type = "" }) => {
    document.title = 'Thêm/Cập nhật di sản';

    let mainText = AddOrUpdateText(type, "di sản");

    const defaultHeritage = {
        id: 0,
        name: '',
        short_description: '',
        time: '',
        image_360_url: '',
        urlslug: '',
        video_url: '',
        location_id: 0,
        management_unit_id: 0,
        heritage_type_id: 0,
        heritage_category_id: 0,
        view_count: 0,
        images: []
    };

    const defaultParagraphs = [
        {
            id: 0,
            title: '',
            description: '',
            image_description: '',
            image_url: '',
            heritage_id: 0
        }
    ];

    const initialState = {
        heritage: {
            ...defaultHeritage,
        },
        paragraphs: defaultParagraphs
    }, [heritageData, setHeritageData] = useState(initialState);

    const [heritageTypeList, setHeritageDataTypeList] = useState([]);
    const [heritageCategoryList, setHeritageDataCategoryList] = useState([]);
    const [locationList, setLocationList] = useState([]);
    const [managementUnitList, setManagementUnitList] = useState([]);
    const [successFlag, SetSuccessFlag] = useState(false);
    const [heritageErrors, setHeritageErrors] = useState({});
    const [paragraphErrors, setParagraphErrors] = useState([]);

    let { id } = useParams();
    id = id ?? 0;

    let maintAction = '';
    if (id === 0) {
        maintAction = 'thêm';
    }
    else {
        maintAction = 'cập nhật';
    }

    //console.log(id);
    useEffect(() => {
        document.title = "Thêm/ cập nhật di sản";

        if (id !== 0) {
            getHeritageWithDetailById(id).then(data => {
                //console.log(data)
                if (data) {
                    const {
                        id: ignoredId,
                        ...heritageData } = data;
                    setHeritageData({
                        ...heritageData
                    });
                    // console.log("Đã bỏ qua id: " + ignoredId);
                } else {
                    setHeritageData(initialState);
                }
            })
        }

        getHeritageTypes().then(data => {
            if (data) {
                setHeritageDataTypeList(data.data);
            }
            else
                setHeritageDataTypeList([]);
            //console.log(data)
        })

        getHeritageCategories().then(data => {
            if (data) {
                setHeritageDataCategoryList(data.data);
            }
            else
                setHeritageDataCategoryList([]);
            //console.log(data)
        })

        getLocations().then(data => {
            if (data) {
                setLocationList(data.data);
            }
            else
                setHeritageDataTypeList([]);
            //console.log(data)
        })

        getManagementUnits().then(data => {
            if (data) {
                setManagementUnitList(data.data);
            }
            else
                setHeritageDataTypeList([]);
            //console.log(data)
        })
    }, [])
    //console.log(heritage)

    //validate lỗi bổ trống
    const validateAllHeritageInput = () => {
        //console.log(heritageData)
        const validationErrors = {};

        if (heritageData.heritage.heritage_type_id === 0) {
            validationErrors.heritage_type_id = 'Vui lòng chọn loại di sản';
        }

        if (heritageData.heritage.name.trim() === '') {
            validationErrors.name = 'Vui lòng nhập tên di sản';
        }

        // if (heritageData.heritage.image_url.trim() === '') {
        //     validationErrors.image_url = 'Vui lòng chọn địa chỉ url của ảnh';
        // }

        if (heritageData.heritage.location_id === 0) {
            validationErrors.location_id = 'Vui lòng chọn địa điểm';
        }

        if (heritageData.heritage.heritage_category_id === 0) {
            validationErrors.heritage_category_id = 'Vui lòng chọn hình thức';
        }

        if (heritageData.heritage.management_unit_id === 0) {
            validationErrors.management_unit_id = 'Vui lòng chọn đơn vị quản lý';
        }

        if (heritageData.heritage.time.trim() === '') {
            validationErrors.time = 'Vui lòng nhập niên đại';
        }

        if (heritageData.heritage.urlslug.trim() === '') {
            validationErrors.urlslug = 'Slug chưa được tạo';
        }

        if (heritageData.heritage.short_description.trim() === '') {
            validationErrors.short_description = 'Vui lòng nhập mô tả chi tiết';
        }

        setHeritageErrors(validationErrors);
        // Kiểm tra nếu có lỗi
        if (Object.keys(validationErrors).length === 0) {
            return false;
        }
        else {
            return true;
        }
    }

    //validate lỗi bổ trống
    const validateAllParagraphInput = () => {
        const validationErrors = [];

        heritageData.paragraphs.forEach((paragraph, index) => {
            const errors = {};
        
            if (paragraph.title.trim() === '') {
              errors.paragraphs_title = 'Vui lòng nhập tiêu đề';
            }
        
            if (paragraph.description.trim() === '') {
              errors.paragraphs_description = 'Vui lòng nhập mô tả chi tiết';
            }
        
            validationErrors[index] = errors;
        });
        
        setParagraphErrors(validationErrors);
        // Kiểm tra nếu có lỗi
        if (Object.keys(validationErrors).length === 0) {
            return false;
        }
        else {
            return true;
        }
    }
    

    const handleSubmit = () => {
        // Nếu không có lỗi mới xóa hoặc cập nhật
        if (validateAllHeritageInput() === false) {
            if (id === 0) {
                addHeritageWithParagraphs(heritageData).then(data => {
                    SetSuccessFlag(data);
                    //console.log(data);
                });
            }
            else {
                putHeritageWithParagraphs(id, heritageData).then(data => {
                    SetSuccessFlag(data);
                    //console.log(data);
                });
            }
        }
    }

    //Xử lý khi bấm xóa bên component con NotificationModal
    const childToParent = (isContinue) => {
        if (isContinue === true && id === 0) {
            setHeritageData(initialState);
            // Reset flag sau khi thêm thành công
            setTimeout(() => { SetSuccessFlag(false); }, 1000)
        }
    }

    // Xử lý ref khi thêm xóa textarea cho mô tả (để thêm <image> hoặc <br>)
    const [textareaRefs, setTextareaRefs] = useState([]);

    const addTextarea = () => {
        setTextareaRefs((prevRefs) => [...prevRefs, createRef()]);
    };

    const removeTextarea = (index) => {
        setTextareaRefs((prevRefs) => {
            const newRefs = [...prevRefs];
            newRefs.splice(index, 1);
            return newRefs;
        });
    };

    // Xử lý nút thêm <image> <br>
    const addString = (stringToAdd, index) => {
        console.log(textareaRefs)
        const newParagraphs = [...heritageData.paragraphs];
        const currentParagraph = newParagraphs[index];
        const { description } = currentParagraph;

        const inputElement = textareaRefs[index].current;
        const { selectionStart, selectionEnd, value } = inputElement;

        const newValue =
            value.substring(0, selectionStart) +
            stringToAdd +
            value.substring(selectionEnd);


        currentParagraph.description = newValue;
        setHeritageData((prevState) => ({
            ...prevState,
            paragraphs: newParagraphs,
        }));


        inputElement.value = newValue;
        // Đặt ví trí con trỏ chuột sau chuỗi vùa thêm, và không chọn bất kì chuỗi nào sau nó
        // = trỏ chuột đứng sau chuỗi vừa thêm
        inputElement.setSelectionRange(
            selectionStart + stringToAdd.length,
            selectionStart + stringToAdd.length
        );
        inputElement.focus();

        // Cập nhật giá trị của short_description
        // setHeritageData(heritageData => ({
        //     ...heritageData,
        //     heritage: {
        //         ...heritageData.heritage,
        //         short_description: newValue
        //     }
        // }));
    };

    // Xử lý sự kiện khi thay đổi đoạn mô tả
    const handleParagraphChange = (index, e) => {
        const newParagraphs = [...heritageData.paragraphs];
        newParagraphs[index][e.target.name] = e.target.value;
        setHeritageData({ ...heritageData, paragraphs: newParagraphs });
    };

    // Xử lý sự kiện khi thêm đoạn mô tả
    const addParagraph = () => {
        addTextarea();
        setHeritageData({
            ...heritageData,
            paragraphs: [...heritageData.paragraphs, { ...defaultParagraphs[0] }]
        });
        // dùng ...defaultParagraphs[0] vì mảng khởi tạo mặc định có 1 phần tử duy nhất trong initialState
    };

    // Xử lý sự kiện khi xóa đoạn mô tả
    const deleteParagraph = index => {
        removeTextarea(index);
        setHeritageData(heritageData => {
            const updatedParagraphs = [...heritageData.paragraphs];
            // xóa 1 phần tử theo index
            updatedParagraphs.splice(index, 1);
            return {
                ...heritageData,
                paragraphs: updatedParagraphs
            };
        });
    };


    return (
        <main>
            <div className="mt-12 px-4">
                <div className="bg-white editor mx-auto flex w-10/12 max-w-2xl flex-col p-6 text-gray-800 shadow-lg mb-12 rounded-lg border-t-4 border-purple-400">
                    <div className="flex mb-4 items-center space-x-5">
                        <div className="h-14 w-14 bg-yellow-200 rounded-full flex flex-shrink-0 justify-center items-center text-yellow-500 text-2xl font-mono">i</div>
                        <div className="block pl-2 font-semibold text-xl self-start text-gray-700">
                            <h2 className="leading-relaxed">{mainText.headingText}</h2>
                            <p className="text-sm text-gray-500 font-normal leading-relaxed">Vui lòng điền vào các ô bên dưới</p>
                        </div>
                    </div>
                    <h2 className="font-semibold text-sm text-teal-500">
                        Tên di sản
                    </h2>
                    <input
                        name="name"
                        required
                        type="text"
                        value={heritageData.heritage.name || ''}
                        onChange={e =>
                            setHeritageData(heritageData => ({
                                ...heritageData,
                                heritage: {
                                    ...heritageData.heritage,
                                    name: e.target.value,
                                    urlslug: generateSlug(e.target.value),
                                }
                            }))
                        }
                        placeholder="Nhập tên di sản"
                        className="text-black mb-4 placeholder-gray-600 w-full px-4 py-2.5 mt-2 text-base   transition duration-500 ease-in-out transform border-transparent rounded-lg bg-gray-200  focus:border-blueGray-500 focus:bg-white dark:focus:bg-gray-800 focus:outline-none focus:shadow-outline focus:ring-1 ring-offset-current ring-offset-2 ring-purple-400" />
                    {heritageErrors.name &&
                        <p className="text-red-500 mb-6 text-sm font-semibold">
                            <FontAwesomeIcon className="mr-2" icon={faXmarkCircle} />
                            {heritageErrors.name}
                        </p>
                    }

                    <h2 className="font-semibold text-sm text-teal-500">
                        UrlSlug
                    </h2>
                    <input
                        name="urlslug"
                        required
                        type="text"
                        value={heritageData.heritage.urlslug || ''}
                        // onChange={e => setHeritageData({
                        //     ...heritageData.heritage,
                        //     UrlSlug: e.target.value
                        // })}
                        placeholder="Nhập định danh slug"
                        className="text-black mb-4 placeholder-gray-600 w-full px-4 py-2.5 mt-2 text-base   transition duration-500 ease-in-out transform border-transparent rounded-lg bg-gray-200  focus:border-blueGray-500 focus:bg-white dark:focus:bg-gray-800 focus:outline-none focus:shadow-outline focus:ring-1 ring-offset-current ring-offset-2 ring-purple-400" />
                    {heritageErrors.urlslug &&
                        <p className="text-red-500 mb-6 text-sm font-semibold">
                            <FontAwesomeIcon className="mr-2" icon={faXmarkCircle} />
                            {heritageErrors.urlslug}
                        </p>
                    }

                    <h2 className="font-semibold text-sm text-teal-500">
                        Loại di sản
                    </h2>
                    <select
                        name='heritage_type_id'
                        value={heritageData.heritage.heritage_type_id}
                        required
                        onChange={e =>
                            setHeritageData(heritageData => ({
                                ...heritageData,
                                heritage: {
                                    ...heritageData.heritage,
                                    heritage_type_id: parseInt(e.target.value, 10)
                                }
                            }))
                        }
                        className=" text-black mb-4 placeholder-gray-600 w-full px-4 py-2.5 mt-2 text-base transition duration-500 ease-in-out transform border-transparent rounded-lg bg-gray-200  focus:border-blueGray-500 focus:bg-white dark:focus:bg-gray-800 focus:outline-none focus:shadow-outline focus:ring-1 ring-offset-current ring-offset-2 ring-purple-400 appearance-none">
                        <option value={0}>--- Chọn loại di sản ---</option>
                        {heritageTypeList.map((item, index) => (
                            <option key={index} value={item.id}>{item.name}</option>
                        ))}
                    </select>
                    {heritageErrors.heritage_type_id &&
                        <p className="text-red-500 mb-6 text-sm font-semibold">
                            <FontAwesomeIcon className="mr-2" icon={faXmarkCircle} />
                            {heritageErrors.heritage_type_id}
                        </p>
                    }

                    <h2 className="font-semibold text-sm text-teal-500">
                        Hình thức di sản
                    </h2>
                    <select
                        name='heritage_category_id'
                        value={heritageData.heritage.heritage_category_id}
                        required
                        onChange={e =>
                            setHeritageData(heritageData => ({
                                ...heritageData,
                                heritage: {
                                    ...heritageData.heritage,
                                    heritage_category_id: parseInt(e.target.value, 10)

                                }
                            }))
                        }
                        className=" text-black mb-4 placeholder-gray-600 w-full px-4 py-2.5 mt-2 text-base transition duration-500 ease-in-out transform border-transparent rounded-lg bg-gray-200  focus:border-blueGray-500 focus:bg-white dark:focus:bg-gray-800 focus:outline-none focus:shadow-outline focus:ring-1 ring-offset-current ring-offset-2 ring-purple-400 appearance-none">
                        <option value={0}>--- Chọn hình thức di sản ---</option>
                        {heritageCategoryList.map((item, index) => (
                            <option key={index} value={item.id}>{item.name}</option>
                        ))}
                    </select>
                    {heritageErrors.heritage_category_id &&
                        <p className="text-red-500 mb-6 text-sm font-semibold">
                            <FontAwesomeIcon className="mr-2" icon={faXmarkCircle} />
                            {heritageErrors.heritage_category_id}
                        </p>
                    }

                    <h2 className="font-semibold text-sm text-teal-500">
                        Địa điểm
                    </h2>
                    <select
                        name='location_id'
                        value={heritageData.heritage.location_id}
                        required
                        onChange={e =>
                            setHeritageData(heritageData => ({
                                ...heritageData,
                                heritage: {
                                    ...heritageData.heritage,
                                    location_id: parseInt(e.target.value, 10)
                                }
                            }))
                        }
                        className=" text-black mb-4 placeholder-gray-600 w-full px-4 py-2.5 mt-2 text-base transition duration-500 ease-in-out transform border-transparent rounded-lg bg-gray-200  focus:border-blueGray-500 focus:bg-white dark:focus:bg-gray-800 focus:outline-none focus:shadow-outline focus:ring-1 ring-offset-current ring-offset-2 ring-purple-400 appearance-none">
                        <option value={0}>--- Chọn địa điểm ---</option>
                        {locationList.map((item, index) => (
                            <option key={index} value={item.id}>{item.name}</option>
                        ))}
                    </select>
                    {heritageErrors.location_id &&
                        <p className="text-red-500 mb-6 text-sm font-semibold">
                            <FontAwesomeIcon className="mr-2" icon={faXmarkCircle} />
                            {heritageErrors.location_id}
                        </p>
                    }

                    <h2 className="font-semibold text-sm text-teal-500">
                        Đơn vị quản lý
                    </h2>
                    <select
                        name='management_unit_id'
                        value={heritageData.heritage.management_unit_id}
                        required
                        onChange={e =>
                            setHeritageData(heritageData => ({
                                ...heritageData,
                                heritage: {
                                    ...heritageData.heritage,
                                    management_unit_id: parseInt(e.target.value, 10)

                                }
                            }))
                        }
                        className=" text-black mb-4 placeholder-gray-600 w-full px-4 py-2.5 mt-2 text-base transition duration-500 ease-in-out transform border-transparent rounded-lg bg-gray-200  focus:border-blueGray-500 focus:bg-white dark:focus:bg-gray-800 focus:outline-none focus:shadow-outline focus:ring-1 ring-offset-current ring-offset-2 ring-purple-400 appearance-none">
                        <option value={0}>--- Chọn đơn vị quản lý ---</option>
                        {managementUnitList.map((item, index) => (
                            <option key={index} value={item.id}>{item.name}</option>
                        ))}
                    </select>
                    {heritageErrors.management_unit_id &&
                        <p className="text-red-500 mb-6 text-sm font-semibold">
                            <FontAwesomeIcon className="mr-2" icon={faXmarkCircle} />
                            {heritageErrors.management_unit_id}
                        </p>
                    }

                    <h2 className="font-semibold text-sm text-teal-500">
                        Niên đại
                    </h2>
                    <input
                        name="time"
                        required
                        type="text"
                        value={heritageData.heritage.time || ''}
                        onChange={e =>
                            setHeritageData(heritageData => ({
                                ...heritageData,
                                heritage: {
                                    ...heritageData.heritage,
                                    time: e.target.value,
                                }
                            }))
                        }
                        placeholder="Nhập thời gian"
                        className="text-black mb-4 placeholder-gray-600 w-full px-4 py-2.5 mt-2 text-base   transition duration-500 ease-in-out transform border-transparent rounded-lg bg-gray-200  focus:border-blueGray-500 focus:bg-white dark:focus:bg-gray-800 focus:outline-none focus:shadow-outline focus:ring-1 ring-offset-current ring-offset-2 ring-purple-400" />
                    {heritageErrors.time &&
                        <p className="text-red-500 mb-6 text-sm font-semibold">
                            <FontAwesomeIcon className="mr-2" icon={faXmarkCircle} />
                            {heritageErrors.time}
                        </p>
                    }

                    <h2 className="font-semibold text-sm text-teal-500">
                        Mô tả ngắn
                    </h2>
                    <textarea
                        name="short_description"
                        required
                        type="text"
                        value={heritageData.heritage.short_description || ''}
                        onChange={e =>
                            setHeritageData(heritageData => ({
                                ...heritageData,
                                heritage: {
                                    ...heritageData.heritage,
                                    short_description: e.target.value
                                }
                            }))
                        }
                        placeholder="Nhập mô tả chi tiết"
                        className="description mb-4 sec h-36 text-black placeholder-gray-600 w-full px-4 py-2.5 mt-2 text-base transition duration-500 ease-in-out transform border-transparent rounded-lg bg-gray-200  focus:border-blueGray-500 focus:bg-white dark:focus:bg-gray-800 focus:outline-none focus:shadow-outline focus:ring-1 ring-offset-current ring-offset-2 ring-purple-400" spellcheck="false" ></textarea>
                    {heritageErrors.short_description &&
                        <p className="text-red-500 mb-6 text-sm font-semibold">
                            <FontAwesomeIcon className="mr-2" icon={faXmarkCircle} />
                            {heritageErrors.short_description}
                        </p>
                    }



                    <h2 className="font-semibold text-sm text-teal-500">
                        Video
                    </h2>
                    <input
                        name="video_url"
                        required
                        type="text"
                        value={heritageData.heritage.video_url || ''}
                        onChange={e =>
                            setHeritageData(heritageData => ({
                                ...heritageData,
                                heritage: {
                                    ...heritageData.heritage,
                                    video_url: e.target.value,
                                }
                            }))
                        }
                        placeholder="Nhập link video"
                        className="text-black mb-4 placeholder-gray-600 w-full px-4 py-2.5 mt-2 text-base   transition duration-500 ease-in-out transform border-transparent rounded-lg bg-gray-200  focus:border-blueGray-500 focus:bg-white dark:focus:bg-gray-800 focus:outline-none focus:shadow-outline focus:ring-1 ring-offset-current ring-offset-2 ring-purple-400" />

                    <h2 className="font-semibold text-sm text-teal-500">
                        Ảnh 360 độ
                    </h2>
                    <input
                        name="image_360_url"
                        required
                        type="text"
                        value={heritageData.heritage.image_360_url || ''}
                        onChange={e =>
                            setHeritageData(heritageData => ({
                                ...heritageData,
                                heritage: {
                                    ...heritageData.heritage,
                                    image_360_url: e.target.value,
                                }
                            }))
                        }
                        placeholder="Nhập link ảnh 360 độ"
                        className="text-black mb-4 placeholder-gray-600 w-full px-4 py-2.5 mt-2 text-base   transition duration-500 ease-in-out transform border-transparent rounded-lg bg-gray-200  focus:border-blueGray-500 focus:bg-white dark:focus:bg-gray-800 focus:outline-none focus:shadow-outline focus:ring-1 ring-offset-current ring-offset-2 ring-purple-400" />



                    {/* Đoan mô tả ============================================================================================================*/}
                    <div className="flex items-center justify-center mt-4">
                        <div className="h-0.5 flex-grow bg-red-500 rounded-full" />
                        <h2 className="px-5 font-semibold text-base text-red-500 text-center">Phần mô tả</h2>
                        <div className="h-0.5 flex-grow bg-red-500 rounded-full" />
                    </div>
                    <ul className="bg-amber-50 rounded-xl py-5 px-10 space-y-1 my-2 text-gray-500 list-disc font-semibold text-xs ">
                        <li>
                            <p>Phần mô tả của di sản được chia ra làm nhiều đoạn, mỗi đoạn bao gồm câu chủ đề, nội dung, hình ảnh và chú thích ảnh</p>
                        </li>
                        <li>
                            <p>Để lưu nhiều ảnh, bạn phải ngăn cách các link ảnh bằng dấu " , ". Tương tự với phần mô tả ảnh</p>
                        </li>
                        <li>
                            <p>{`Để hiển thị ảnh trong phần nội dung bạn cần phải thêm <image> tại vị trí muốn hiển thị`}</p>
                        </li>
                        <li>
                            <p>{`Để ngắt đoạn trong phần nội dung bạn cần phải thêm <br> tại vị trí muốn ngắt đoạn`}</p>
                        </li>
                    </ul>

                    {heritageData.paragraphs.map((paragraph, index) => {
                        const ref = textareaRefs[index] || addTextarea();
                        return (
                            <div key={index} className="relative bg-gray-50 my-5 px-10 py-5 rounded-xl shadow-md">
                                <p className="absolute top-0 right-0 text-white text-xs rounded-bl-xl rounded-tr-xl font-semibold px-4 py-2 bg-teal-500">Đoạn thứ {index + 1}</p>
                                <h2 className="font-semibold text-sm text-teal-500">Tiêu đề</h2>
                                <input
                                    name="title"
                                    required
                                    type="text"
                                    value={paragraph.title}
                                    placeholder="Nhập câu chủ đề"
                                    onChange={(e) => handleParagraphChange(index, e)}
                                    className="text-black mb-4 placeholder-gray-600 w-full px-4 py-2.5 mt-2 text-base   transition duration-500 ease-in-out transform border-transparent rounded-lg bg-gray-200  focus:border-blueGray-500 focus:bg-white dark:focus:bg-gray-800 focus:outline-none focus:shadow-outline focus:ring-1 ring-offset-current ring-offset-2 ring-purple-400" />
                                {paragraphErrors[index] && paragraphErrors[index].paragraphs_title &&
                                    <p className="text-red-500 mb-6 text-sm font-semibold">
                                        <FontAwesomeIcon className="mr-2" icon={faXmarkCircle} />
                                        {paragraphErrors[index].paragraphs_title}
                                    </p>
                                }

                                <h2 className="font-semibold text-sm text-teal-500">
                                    Hình ảnh
                                </h2>
                                <textarea
                                    name="image_url"
                                    required
                                    value={paragraph.image_url}
                                    placeholder="Nhập link ảnh"
                                    rows="3"
                                    onChange={(e) => handleParagraphChange(index, e)}
                                    className="text-black mb-2 placeholder-gray-600 w-full px-4 py-2.5 mt-2 text-base transition duration-500 ease-in-out transform border-transparent rounded-lg bg-gray-200  focus:border-blueGray-500 focus:bg-white dark:focus:bg-gray-800 focus:outline-none focus:shadow-outline focus:ring-1 ring-offset-current ring-offset-2 ring-purple-400" />

                                {!isEmptyOrSpaces(paragraph.image_url) && <>
                                    <p className="text-gray-600 mb-4 text-center">Ảnh hiện tại</p>
                                    <div className="mb-4">
                                        <div className={splitImageUrls(paragraph.image_url).length > 1 && "w-full h-auto mb-4 grid grid-cols-3 gap-x-4 gap-y-4"}>
                                            {splitImageUrls(paragraph.image_url).map((imageUrl, index) => (
                                                <img
                                                    key={index}
                                                    src={imageUrl}
                                                    className="rounded-lg"
                                                    alt={`Ảnh thứ ${index + 1}`}
                                                />
                                            ))}
                                        </div>
                                    </div>

                                </>}

                                <h2 className="font-semibold text-sm text-teal-500">Mô tả ảnh</h2>
                                <textarea
                                    name="image_description"
                                    required
                                    value={paragraph.image_description}
                                    placeholder="Nhập mô tả ảnh"
                                    rows="3"
                                    onChange={(e) => handleParagraphChange(index, e)}
                                    className="text-black mb-2 placeholder-gray-600 w-full px-4 py-2.5 mt-2 text-base transition duration-500 ease-in-out transform border-transparent rounded-lg bg-gray-200  focus:border-blueGray-500 focus:bg-white dark:focus:bg-gray-800 focus:outline-none focus:shadow-outline focus:ring-1 ring-offset-current ring-offset-2 ring-purple-400" />

                                <h2 className="font-semibold text-sm text-teal-500">Nội dung</h2>
                                <textarea
                                    ref={ref}
                                    name="description"
                                    required
                                    value={paragraph.description}
                                    placeholder="Nhập nội dung"
                                    rows="5"
                                    onChange={(e) => handleParagraphChange(index, e)}
                                    className="text-black mb-2 placeholder-gray-600 w-full px-4 py-2.5 mt-2 text-base transition duration-500 ease-in-out transform border-transparent rounded-lg bg-gray-200  focus:border-blueGray-500 focus:bg-white dark:focus:bg-gray-800 focus:outline-none focus:shadow-outline focus:ring-1 ring-offset-current ring-offset-2 ring-purple-400" />
                                {paragraphErrors[index] && paragraphErrors[index].paragraphs_description &&
                                    <p className="text-red-500 mb-6 text-sm font-semibold">
                                        <FontAwesomeIcon className="mr-2" icon={faXmarkCircle} />
                                        {heritageErrors.paragraphs_description}
                                    </p>
                                }
                                {console.log(paragraphErrors)}

                                <div className="flex items-center justify-end">
                                    <button onClick={() => addString('<image>', index)} className="btn ml-2 rounded-md transition duration-300 ease-in-out cursor-pointer hover:bg-emerald-700 bg-emerald-500 p-2 px-3 font-semibold text-white text-xs">
                                        Thêm image
                                    </button>
                                    <button onClick={() => addString('<br>', index)} className="btn ml-2 rounded-md transition duration-300 ease-in-out cursor-pointer hover:bg-amber-500 bg-amber-400 p-2 px-3 font-semibold text-white text-xs">
                                        Thêm line break
                                    </button>
                                    <button onClick={() => deleteParagraph(index)} className="btn ml-2 rounded-md transition duration-300 ease-in-out cursor-pointer hover:bg-red-600 bg-red-500 p-2 px-3 font-semibold text-white text-xs">
                                        Xóa
                                    </button>
                                </div>
                            </div>
                        )
                    })}

                    <div className="flex items-center justify-center my-4">
                        <button onClick={addParagraph} className="btn rounded-full transition duration-300 ease-in-out cursor-pointer hover:bg-indigo-600 bg-white-500 p-2 px-5 text-sm font-semibold text-indigo-500 hover:text-white border border-2 border-indigo-500 hover:border-indigo-600">
                            Thêm đoạn văn
                        </button>
                    </div>


                    <div className="buttons flex">
                        <hr className="mt-4" />
                        <Link to="/admin/dashboard/all-heritage" className="btn ml-auto rounded-md transition duration-300 ease-in-out cursor-pointer hover:bg-gray-500 p-2 px-5 font-semibold hover:text-white text-gray-500">
                            Hủy
                        </Link>
                        <button id="notification_buttonmodal" onClick={() => { handleSubmit() }} type="submit" className="btn ml-2 rounded-md transition duration-300 ease-in-out cursor-pointer !hover:bg-indigo-700 !bg-indigo-500 p-2 px-5 font-semibold text-white">
                            {mainText.buttonText}
                        </button>
                    </div>

                    <NotificationModal mainAction={maintAction} isSuccess={successFlag} isContinue={childToParent} type="heritage" />
                </div>

            </div>
        </main>
    );
}
