import React, { useEffect, useState, useRef } from "react";
import { IoIosArrowBack } from "react-icons/io";
import "../styles/AlbumDetails.css";
import {
  openAlbumDetail,
  setOpenImageDetail,
  setImage_clicked,
  removeOpenImageDetail,
  createComment,
} from "../../../features/UserSlice";
import axios from "axios";
import { setAlbumImages, setAlbumTitle, setAlbum_ID, setAlbum_username} from "../../../features/AlbumSlice";
import bufferToDataUrl from "../../../utils/ImageConvertor";
import { HiOutlinePlus } from "react-icons/hi";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { AiOutlineClose } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
axios.defaults.withCredentials = true;

const AlbumDetails = () => {
  const dispatch = useAppDispatch();

  const user_granted_to_add = useAppSelector(
    (state) => state.userInfo.granted_access
  );

  const isOpenImageDetails = useAppSelector(
    (state) => state.userInfo.open_imageDetail
  );

  const [isPopupOpen, setisPopupOpen] = useState<boolean>(false);
  const popupRef = useRef<HTMLDivElement | null>(null);
  const [fileToSend, setFileToSend] = useState<any>(null);
  const [image, setImage] = useState<any>(null);
  const [newImageTitle, setNewImageTitle] = useState<string>("");
  const [newDescription, setNewDescription] = useState<string>("");
  const album_ID = useAppSelector((state) => state.album_details.album_id);
  const navigate = useNavigate();

  const handleNewImageTitle = (value: string) => {
    setNewImageTitle(value);
  };
  const handleNewDescription = (value: string) => {
    setNewDescription(value);
  };

  useEffect(() => {
    console.log(fileToSend);
  }, [fileToSend]);

  const handleImageSelection = (image: File) => {
    setFileToSend(image);

    if (image) {
      const reader = new FileReader();
      reader.onload = (event: any) => {
        setImage(event.target.result);
      };
      reader.readAsDataURL(image);
    }
    setisPopupOpen(true);
  };

  const loadAlbumDetail = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3001/album/detail?album_ID=${album_ID}`,
        {
          withCredentials: true,
        }
      );
      dispatch(setAlbumTitle(response.data.content.title));
      dispatch(setAlbum_ID(response.data.content._id));
      dispatch(setAlbum_username(response.data.content.creator_id.username));
         const images_state: any = [];

         await response.data.content.images.forEach((image: any) => {
           const image_detail = {
             id: image._id,
             title: image.title,
             desc: image.description,
             comments: image.comments,
             data: bufferToDataUrl(image.image.data),
           };
           images_state.push(image_detail);
         });
       

         dispatch(setAlbumImages(images_state));
    } catch (err: any) {
      const errorredirect = "invalid token 2";
      const errorredirect2 = "invalid token 1";
      const errorredirect3 = "invalid token";
      if (
        err.response.data.message === errorredirect ||
        err.response.data.message === errorredirect2 ||
        err.response.data.message === errorredirect3
      ) {
        navigate("/");
      }

      console.log(err.response.data.message);
    }
  };

  const FetchNewImage = async (e: any) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      const date = new Date();
      formData.append("image", fileToSend);
      formData.append("title", newImageTitle);
      formData.append("description", newDescription);
      formData.append("album_ID", album_ID);
      formData.append("date", date.toISOString());
      const response = await axios.post(
        "http://localhost:3001/album/uploadimage",

        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      loadAlbumDetail();
      setisPopupOpen(false);
     

      
    } catch (err) {
      console.log(err);
    }
  };

  const closeMenus = ( e: any) =>{
    dispatch(openAlbumDetail());
    dispatch(removeOpenImageDetail())
  }

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setisPopupOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const images = useAppSelector((state) => state.album_details?.images);

  return (
    <>
      <div className="album-detail-wrapper">
        <div className="album-detail-nav">
          <IoIosArrowBack
            style={{ cursor: "pointer", color: "white", marginLeft: "1rem" }}
            onClick={(e) => closeMenus(e)}
          />
        </div>
        <h1 className="album-detail-title">
          {useAppSelector((state) => state.album_details.title)}
        </h1>
        <div className="album-detail-wrapper">
          {images.map((image: any, index: number) => {
            return (
              <Image
                key={index}
                image={image.data}
                title={image.title}
                comments={image.comments}
                description={image.desc}
                image_ID={image.id}
              />
            );
          })}
          {user_granted_to_add === true ? (
            <label htmlFor="image" className="add-image-wrapper">
              <div className="add-image-column">
                <h4>Aggiungi un'immagine</h4>
                <HiOutlinePlus style={{ color: "#427290", strokeWidth: 4 }} />
                <div
                  ref={popupRef}
                  className={isPopupOpen === false ? "hidden" : "popupform"}
                >
                  <div className="selected-image-wrapper">
                    <img
                      className="selected-image"
                      src={image}
                      alt="img_selezionata"
                    />
                  </div>
                  <form
                    className="compilazione"
                    onSubmit={(e) => FetchNewImage(e)}
                  >
                    <div className="add-new-image-desc-tit">
                      <div className="close-window-imagedesc">
                        <AiOutlineClose
                          style={{
                            color: "white",
                            marginRight: "4%",
                            cursor: "pointer",
                          }}
                          onClick={() => setisPopupOpen(false)}
                        />
                      </div>
                      <input
                        type="text"
                        placeholder="Insert a title..."
                        onChange={(e) => handleNewImageTitle(e.target.value)}
                        style={{borderBottom : "1px solid rgb(56,56,56)", color : "white"}}
                      />
                      <textarea
                        name="descr"
                        id="descr"
                        cols={30}
                        rows={30}
                        placeholder="Insert a description..."
                        className="didascalia"
                        onChange={(e) => handleNewDescription(e.target.value)}
                      ></textarea>
                    </div>
                    <button
                      type="submit"
                      style={{
                        color: "#4c68d7",
                        borderTop: "1px solid rgb(56, 56, 56) ",
                        height: "10%",
                      }}
                    >
                      Pubblica
                    </button>
                  </form>
                </div>
              </div>
              <input
                type="file"
                id="image"
                name="image"
                accept="image/png, image/jpeg"
                className="hidden"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const selectedFile =
                    e.currentTarget.files && e.currentTarget.files[0];
                  if (selectedFile) {
                    handleImageSelection(selectedFile);
                  }
                }}
              />
            </label>
          ) : (
            ""
          )}
        </div>
      </div>
      {isOpenImageDetails === true ? <ImageDetails /> : ""}
    </>
  );
};

interface props {
  image: any;
  title: string;
  comments: any;
  description: string;
  image_ID: any;
}

const Image = ({ image, title, comments, description, image_ID }: props) => {
  const dispatch = useAppDispatch();

  const openDetailMenu = () => {
    dispatch(setOpenImageDetail());
    const image_clicked_detail = {
      image: image,
      comments: comments,
      title: title,
      description: description,
      image_ID: image_ID,
    };
    dispatch(setImage_clicked(image_clicked_detail));
  };

  return (
    <div className="image-wrapper">
      <div className="image-content"> 
          <img
            className="img-img"
            src={image}
            alt="image"
            onClick={openDetailMenu}
          />
        
      </div>
    </div>
  );
};

const ImageDetails = () => {
  const dispatch = useAppDispatch();
  const username = window.localStorage.getItem("username");

  const album_ID = useAppSelector((state) => state.album_details.album_id);
  const navigate = useNavigate();
  const [comment, setComment] = useState<string>("");
  const image_ID = useAppSelector(
    (state) => state.userInfo.image_clicked.image_ID
  );

  const loadAlbumDetail = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3001/album/detail?album_ID=${album_ID}`,
        {
          withCredentials: true,
        }
      );
      dispatch(setAlbumTitle(response.data.content.title));
      dispatch(setAlbum_ID(response.data.content._id));
      dispatch(setAlbum_username(response.data.content.creator_id.username));
          const images_state: any = [];

          await response.data.content.images.forEach((image: any) => {
            const image_detail = {
              id: image._id,
              title: image.title,
              desc: image.description,
              comments: image.comments,
              data: bufferToDataUrl(image.image.data),
            };
            images_state.push(image_detail);
          });
        

          dispatch(setAlbumImages(images_state));
    } catch (err: any) {
      const errorredirect = "invalid token 2";
      const errorredirect2 = "invalid token 1";
      const errorredirect3 = "invalid token";
      if (
        err.response.data.message === errorredirect ||
        err.response.data.message === errorredirect2 ||
        err.response.data.message === errorredirect3
      ) {
        navigate("/");
      }

      console.log(err.response.data.message);
    }
  };

  const fetchAddComment = async (e: any) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:3001/comment", {
        text: comment,
        date: new Date(),
        image_ID: image_ID,
      });
      dispatch(
        createComment({
          username: username,
          text: comment,
          date: new Date().toISOString(),
        })
      );
      loadAlbumDetail();
    } catch (err: any) {
      const errorredirect = "invalid token 2";
      const errorredirect2 = "invalid token 1";
      const errorredirect3 = "invalid token";
      if (
        err.response.data.message === errorredirect ||
        err.response.data.message === errorredirect2 ||
        err.response.data.message === errorredirect3
      ) {
        navigate("/");
      }

      console.log(err.response.data.message);
    }
  };

  const handleChangeInput = (value: string) => {
    setComment(value);
  };

  const comments = useAppSelector(
    (state) => state.userInfo.image_clicked.comments
  );
  const creator_username = useAppSelector(
    (state) => state.album_details.username
  );
  const description = useAppSelector(
    (state) => state.userInfo.image_clicked.description
  );

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (
        imageDetailRef.current &&
        !imageDetailRef.current.contains(event.target)
      ) {
        dispatch(removeOpenImageDetail());
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const imageDetailRef = useRef<HTMLDivElement | null>(null);

  const img = useAppSelector((state) => state.userInfo.image_clicked.image);
  return (
    <div className="image-detail-wrapper" ref={imageDetailRef}>
      <div className="img-detail-wrapper">
        <img className="img-detail-img" src={img} alt="imga" />
      </div>
      <div className="content-section-wrap">
        <div className="image-detail-title-wrapper">
            <h5  className= "title-new-im">
              {useAppSelector((state) => state.userInfo.image_clicked.title)}
            </h5>
            <AiOutlineClose
              style={{ color: "white", marginRight: "4%", cursor: "pointer" }}
              onClick={() => dispatch(removeOpenImageDetail())}
            />
        </div>
        <div className="image-description-wrapper">
          <p className="description-content">
            <span style={{ fontWeight: "bolder", fontSize: "medium" }}>
              {creator_username}{" "}
            </span>
            {description}
          </p>
        </div>
        <div className="content-scrolling">
          {comments?.map((comment: any, index : number) => {
            const commentDate = new Date(comment.date);
            const formattedDate = commentDate.toLocaleString("it-IT", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            });

            return (
              <div className="comment-wrapper" key={index}>
                <p className="comment-para">
                  <span style={{ fontWeight: "bold" }}>
                    {comment.creator.username}
                  </span>{" "}
                  {comment.text}
                </p>
                <h6 className="comment-date">{formattedDate}</h6>
              </div>
            );
          })}
        </div>

        <form
          className="add-comment-wrapper"
          onSubmit={(e) => fetchAddComment(e)}
        >
          <input
            placeholder="Aggiungi un commento..."
            type="text"
            onChange={(event) => handleChangeInput(event.target.value)}
            style={{ color: "white" }}
          />
          <button className="pubblica">Pubblica</button>
        </form>
      </div>
    </div>
  );
};

export default AlbumDetails;
