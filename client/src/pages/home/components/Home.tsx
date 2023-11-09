import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Home.css";
import { HiOutlinePlus } from "react-icons/hi";
import { IoIosArrowDown, IoIosArrowForward } from "react-icons/io";
import bufferToDataUrl from "../../../utils/ImageConvertor";
import {
  openAlbumDetail,
  setGrantedAccess,
  removeGrantedAccess,
} from "../../../features/UserSlice";
import AlbumDetails from "./AlbumDetails";
import {
  setAlbumImages,
  setAlbumTitle,
  setAlbum_ID,
  setAlbum_username,
} from "../../../features/AlbumSlice";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { AiOutlineClose } from "react-icons/ai";
import { Oval } from "react-loader-spinner";
import { useNavigate } from "react-router-dom";
import { debounce } from "lodash";

axios.defaults.withCredentials = true;

const Home = () => {
  const [globalalbums, setglobalAlbums] = useState<any>([]);
  const [myalbums, setMyAlbums] = useState<any>([]);
  const userID = useAppSelector((state) => state.userInfo.user_ID);
  const [isPopupOpen, setisPopupOpen] = useState<number>(0);
  const [isloaded, setisLoaded] = useState<boolean>(false);
  const [fileToSend, setFileToSend] = useState<any>(null);
  const [image, setImage] = useState<any>(null);
  const [newTitle, setNewTitle] = useState<string>("");
  const [newImageValues, setNewImagesValue] = useState<any>({
    newimage_title: "",
    newimage_descr: "",
  });
  const navigate = useNavigate();

  const handleNewImageValues = (field: string, value: string) => {
    setNewImagesValue((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  };

  const debouncedHandleNewImageValues = debounce(handleNewImageValues, 1000);

  const [foldedMenus, setFoldedMenus] = useState({
    global: false,
    personal: false,
  });

  const handleNewTitle = (value: any) => {
    setNewTitle(value);
  };

  const albumdetailsisopen = useAppSelector(
    (state) => state.userInfo.open_albumDetail
  );
  const foldMenu = (type: string) => {
    if (type === "global") {
      if (foldedMenus.global === false) {
        setFoldedMenus((prev) => ({
          ...prev,
          global: true,
        }));
      } else {
        setFoldedMenus((prev) => ({
          ...prev,
          global: false,
        }));
      }
    }
    if (type === "personal") {
      if (foldedMenus.personal === false) {
        setFoldedMenus((prev) => ({
          ...prev,
          personal: true,
        }));
      } else {
        setFoldedMenus((prev) => ({
          ...prev,
          personal: false,
        }));
      }
    }
  };

  const createNewAlbum = async (event: any) => {
    event?.preventDefault();

    try {
      const date = new Date();

      const formData = new FormData();
      formData.append("image", fileToSend);
      formData.append("title", newTitle);
      formData.append("date", date.toISOString());
      formData.append("image_description", newImageValues.newimage_descr);
      formData.append("image_title", newImageValues.newimage_title);

      const response = await axios.post(
        "http://localhost:3001/album/create",
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setisPopupOpen(0);
      loadAlbums();
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

  const selectAlbums = (albums: any) => {
    const myalbums = albums.filter(
      (album: any) => album.creator_id._id === userID
    );
    const globalalbums = albums.filter(
      (album: any) => album.creator_id._id !== userID
    );

    setMyAlbums(myalbums);
    setglobalAlbums(globalalbums);
  };

  const handleImageSelection = (image: File) => {
    setFileToSend(image);

    if (image) {
      const reader = new FileReader();
      reader.onload = (event: any) => {
        setImage(event.target.result);
      };
      reader.readAsDataURL(image);
    }
    setisPopupOpen(2);
  };

  useEffect(() => {
    console.log(isPopupOpen);
  }, [isPopupOpen]);

  const loadAlbums = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3001/album/getalbums",
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      selectAlbums(response.data.albums);
      setisLoaded(true);
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

  const handleOpenNewAlbum = () => {
    if (isPopupOpen === 0) {
      setisPopupOpen(1);
    }
  };

  const handleLogout =  async () =>{

      try {
        const response = await axios.post(
          `http://localhost:3001/auth/logout/`,
          null,
          {
            withCredentials: true,
          }
        );
        console.log(response.data);

        navigate("/");
      } catch (err) {
        console.log(err);
      }

  }

  useEffect(() => {
    loadAlbums();
  }, []);
  return isloaded === true ? (
    <div className="home-wrapper">
      <section
        className={albumdetailsisopen === false ? "global-albums" : "hidden"}
      >
        <div className="logout-bar">

          <h3 style={{marginRight : "1rem"}} onClick={handleLogout}>Logout</h3>

        </div>
        <div className="description-albums">
          <IoIosArrowDown
            className={foldedMenus.global === false ? "" : "hidden"}
            onClick={() => foldMenu("global")}
            style={{ color: "white" }}
          />
          <IoIosArrowForward
            className={foldedMenus.global === true ? "" : "hidden"}
            style={{ color: "white" }}
            onClick={() => foldMenu("global")}
          />
          <h3 style={{ color: "white" }}>Global albums</h3>
        </div>
        <div
          className={`albums-wrapper ${
            foldedMenus.global === false ? "" : "hidden"
          }`}
        >
          {globalalbums?.map((album: any, index: number) => (
            <AlbumCard
              title={album?.title}
              key={index}
              ID={album?._id}
              username={album?.creator_id.username}
              thumbnail={album?.images[0]?.image?.data}
              creator_ID={album?.creator_id?._id}
            />
          ))}
        </div>
        <div className="description-albums">
          <IoIosArrowDown
            className={foldedMenus.personal === false ? "" : "hidden"}
            onClick={() => foldMenu("personal")}
            style={{ color: "white" }}
          />
          <IoIosArrowForward
            className={foldedMenus.personal === true ? "" : "hidden"}
            onClick={() => foldMenu("personal")}
            style={{ color: "white" }}
          />

          <h3 style={{ color: "white" }}>My albums</h3>
        </div>
        <div
          className={`albums-wrapper ${
            foldedMenus.personal === false ? "" : "hidden"
          }`}
        >
          {myalbums?.map((album: any, index: number) => (
            <AlbumCard
              title={album?.title}
              key={index}
              ID={album?._id}
              username={album?.creator_id.username}
              thumbnail={album?.images[0]?.image?.data}
              creator_ID={album?.creator_id?._id}
            />
          ))}
          <div
            className="create-album-wrapper"
            onClick={() => handleOpenNewAlbum()}
          >
            <div className="create-albumn-column">
              <h4 style={{ color: "white" }}>Crea un nuovo album</h4>
              <HiOutlinePlus style={{ color: "white", strokeWidth: 4 }} />
            </div>
          </div>
          <div className={isPopupOpen === 1 ? "popupnewalbum" : "hidden"}>
            <div className="close-window-section">
              <AiOutlineClose
                style={{ color: "white", marginRight : "0.5rem" }}
                onClick={() => setisPopupOpen(0)}
              />
            </div>
            <div className="titolo-wrapper">
              <input
                type="text"
                placeholder="Insert a title..."
                onChange={(e) => handleNewTitle(e.target.value)}
                style={{ color: "white" }}
              />
            </div>
            <div className="new-label-wrapper">
              <label htmlFor="newthumbnail" className="newthumbnailhome">
                {" "}
                Select thumbnail
                <input
                  type="file"
                  id="newthumbnail"
                  name="newthumbnail"
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
            </div>
          </div>

          <form
            className={isPopupOpen === 2 ? "add-image-desc-title" : "hidden"}
            onSubmit={(e) => createNewAlbum(e)}
            id="newalbumform"
          >
            {" "}
            <div className="new-thumbnail-wrapper">
              <img className="thumbnail-detail" src={image} alt="thumb" />
            </div>
            <div className="content-thumbnail-wrapper">
              <div className="input-values-images">
                <div className="new-thumbnail-title">

                  <AiOutlineClose
                    style={{  marginRight: "1rem" , color: "white" }}
                    onClick={() => setisPopupOpen(0)}
                    />
                </div>
                <input
                  type="text"
                  placeholder="Inserisci un titolo..."
                  style={{
                    borderBottom: " 0.5px solid gray",
                    height: "10%",
                    color: "white",
                  }}
                  onChange={(e) =>
                    debouncedHandleNewImageValues(
                      "newimage_title",
                      e.target.value
                    )
                  }
                />
                <textarea
                  name="newimagedescr"
                  id="newimagedesc"
                  placeholder="Inserisci una descrizione..."
                  cols={30}
                  rows={10}
                  className="newimage-description"
                  onChange={(e) =>
                    debouncedHandleNewImageValues(
                      "newimage_descr",
                      e.target.value
                    )
                  }
                ></textarea>
              </div>
              <button className="inviaimmagine" type="submit">
                submit
              </button>
            </div>
          </form>
        </div>
      </section>
      {albumdetailsisopen === true ? <AlbumDetails /> : ""}
    </div>
  ) : (
    <LoaderComponent />
  );
};

const LoaderComponent = () => {
  return (
    <div className="loaderstate">
      <Oval
        height={50}
        width={50}
        color="#82d4c8"
        wrapperStyle={{}}
        wrapperClass=""
        visible={true}
        ariaLabel="oval-loading"
        secondaryColor="#4da998"
        strokeWidth={2}
        strokeWidthSecondary={2}
      />
    </div>
  );
};

interface props {
  title: string;
  ID: string;
  username: string;
  thumbnail: any;
  creator_ID: string;
}

const AlbumCard = ({ title, ID, username, thumbnail, creator_ID }: props) => {
  const image = bufferToDataUrl(thumbnail);
  const dispatch = useAppDispatch();
  const userID = useAppSelector((state) => state.userInfo.user_ID);
  const navigate = useNavigate();

  const loadAlbumDetail = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3001/album/detail?album_ID=${ID}`,
        {
          withCredentials: true,
        }
      );
      dispatch(setAlbumTitle(response.data.content.title));
      dispatch(setAlbum_ID(response.data.content._id));
      dispatch(setAlbum_username(response.data.content.creator_id.username));
      console.log(response.data.content.images);

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
      dispatch(openAlbumDetail());
      if (userID === creator_ID) {
        dispatch(setGrantedAccess());
      } else {
        dispatch(removeGrantedAccess());
      }
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
  return (
    <div className="album-container">
      <div className="album">
        <div className="thumbnail-wrapper">
          <img
            className="thumbnail"
            src={image}
            alt="immagine"
            onClick={loadAlbumDetail}
          />
        </div>
        <div className="album-description">
          <h5 className="album-title">{title}</h5>
          <h6>{username}</h6>
        </div>
      </div>
    </div>
  );
};

export default Home;
