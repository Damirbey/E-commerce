import { useNavigate, useParams } from "react-router-dom";
import React, {useContext, useEffect, useReducer, useState} from 'react';
import { Helmet } from "react-helmet-async";
import { toast } from "react-toastify";
import { getError } from "../utils";
import axios from "axios";
import { Store } from "../Store";
import { FaWindowClose } from "react-icons/fa";


const reducer = (state,action)=>{
    switch(action.type){
        case 'FETCH_REQUEST':
            return {...state, loading:true};
        case 'FETCH_SUCCESS':
            return {...state, loading: false};
        case 'FETCH_FAIL':
            return {...state, loading: false, error:action.payload};
        case 'UPDATE_REQUEST':
            return {...state, loadingUpdate:true};
        case 'UPDATE_SUCCESS':
            return {...state, loadingUpdate: false};
        case 'UPDATE_FAIL':
            return {...state, loadingUpdate: false, error:action.payload};
        case 'UPLOAD_REQUEST':
            return { ...state, loadingUpload: true, errorUpload: '' };
        case 'UPLOAD_SUCCESS':
            return {
                ...state,
                loadingUpload: false,
                errorUpload: '',
            };
        case 'UPLOAD_FAIL':
            return { ...state, loadingUpload: false, errorUpload: action.payload };
        default:
            return state;
    }
}
function AdminProductEditPage(){
    const [{ loading,loadingUpdate, loadingUpload, product, error }, dispatch] = useReducer(reducer, {
        loading: true,
        error: ''
    });
    const params = useParams();
    const {id:productId} = params;
    const {state, dispatch:ctxDispatch} = useContext(Store);
    const {userInfo} = state;
    const navigate = useNavigate(); 

    const uploadFileHandler = async (e, forImages) => {
        const file = e.target.files[0];
        const bodyFormData = new FormData();
        bodyFormData.append('file', file);
        try {
          dispatch({ type: 'UPLOAD_REQUEST' });
          const { data } = await axios.post('/api/upload', bodyFormData, {
            headers: {
              'Content-Type': 'multipart/form-data',
              authorization: `Bearer ${userInfo.token}`,
            },
          });
          dispatch({ type: 'UPLOAD_SUCCESS' });
          if (forImages) {
            setImages([...images, data.secure_url]);
          } else {
            setImage(data.secure_url);
          }
          toast.success('Image uploaded successfully. click Update to apply it');
        } catch (err) {
          toast.error(getError(err));
          dispatch({ type: 'UPLOAD_FAIL', payload: getError(err) });
        }
    };

    const deleteFileHandler = async(filename,f)=>{
        setImages(images.filter((x) => x !== filename));
        toast.success('Image removed successfully. click Update to apply it');
    }

    const onSubmitHandler = async (e) =>{
        e.preventDefault();
        try{
            dispatch({type:"UPDATE_REQUEST"});
            await axios.put(`/api/getProducts/${productId}`,
                {
                    id: productId,
                    name,
                    category,
                    price,
                    countInStock,
                    description,
                    image,
                    images,
                    brand,
                    slug
                },
                {
                    headers: { Authorization: `Bearer ${userInfo.token}` }
                }
            );
            toast.success("Product Updated Successfully");
            navigate('/adminProducts');
        }catch(err){
            dispatch({type:"UPDATE_FAIL"});
            toast.error(getError(err));
        }
    }

    useEffect(()=>{
        const fetchProduct = async () =>{
            try{
                dispatch({type:"FETCH_REQUEST"});
                const {data} = await axios.get(`/api/getProducts/id/${productId}`);
                setName(data.name);
                setCategory(data.category);
                setPrice(data.price);
                setCountInStock(data.countInStock);
                setDescription(data.description);
                setImage(data.image);
                setImages(data.images);
                setBrand(data.brand);
                setSlug(data.slug);
                dispatch({type:"FETCH_SUCCESS"})
            }catch(err){
                dispatch({type:"FETCH_FAIL"});
                toast.error(getError(err));
            }
        }
        fetchProduct();
    },[productId]);


    const [name, setName] = useState('');
    const [slug, setSlug] = useState('');
    const [category, setCategory] = useState('');
    const [brand, setBrand] = useState('');
    const [price, setPrice] = useState('');
    const [countInStock, setCountInStock] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState('');
    const [images, setImages] = useState('');

    return(
        
        <div className="editProduct">
            <Helmet>
                <title>
                    Edit Product
                </title>
            </Helmet>
            <h1 className="heading-1 bold-text">Edit Product {productId}</h1>

            <form className="form" onSubmit={onSubmitHandler}>  
                <p className="form_label">Name</p>
                <input type="text" name="name" className="form_input" value={name} onChange={(e)=>setName(e.target.value)}/>

                <p className="form_label">Slug</p>
                <input type="text" name="slug" className="form_input" value={slug} onChange={(e)=>setSlug(e.target.value)}/>

                <p className="form_label">Price</p>
                <input type="text" name="price" className="form_input" value={price} onChange={(e)=>setPrice(e.target.value)}/>

                <p className="form_label">Image File</p>
                <input type="text" name="image" className="form_input" value={image} onChange={(e)=>setImage(e.target.value)}/>

                <p className="form_label">Upload Image</p>
                <input type="file" name="image" className="form_input" onChange={uploadFileHandler}/>
                <div>
                    {images.length > 0 && <p>Additional Images</p>
                    }    
                    {images && images.map(image=>(
                        <div className="form_input_listgroup">
                            <span>{image} </span>
                            <FaWindowClose onClick={()=>deleteFileHandler(image)}/>
                        </div>
                        
                    ))}
                </div>
                <p className="form_label">Upload Additional Image</p>
                <input type="file" name="image" className="form_input" onChange={(e)=>uploadFileHandler(e,true)}/>

                <p className="form_label">Category</p>
                <input type="text" name="category" className="form_input" value={category} onChange={(e)=>setCategory(e.target.value)}/>

                <p className="form_label">Brand</p>
                <input type="text" name="brand" className="form_input" value={brand} onChange={(e)=>setBrand(e.target.value)}/>

                <p className="form_label">Count In Stock</p>
                <input type="text" name="countInStock" className="form_input" value={countInStock} onChange={(e)=>setCountInStock(e.target.value)}/>
                
                <p className="form_label">Description</p>
                <input type="text" name="description" className="form_input" value={description} onChange={(e)=>setDescription(e.target.value)}/>
                
                <button type="submit" className="btn form_btn">Update</button>
               
            </form>

        </div>
    )
}

export default AdminProductEditPage;