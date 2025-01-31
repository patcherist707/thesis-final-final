import { Button, TextInput, Accordion, Modal, Alert } from 'flowbite-react';
import { useSelector } from 'react-redux';
import {useEffect, useState, useRef} from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../firebase';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import {
  updateStart,
  updateSuccess,
  updateFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signoutSuccess,
} from '../redux/user/userSlice';
import { useDispatch } from 'react-redux';
import { HiOutlineExclamationCircle } from 'react-icons/hi';

export default function DashProfile() {
  const [firstShowModal, setFirstShowModal] = useState(false);
  const [secondShowModal, setSecondShowModal] = useState(false);
  const [getOldPassword, setGetOldPassword] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const { currentUser, err } = useSelector((state) => state.user);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [imageFileUploading, setImageFileUploading] = useState(false);
  const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
  const [updateUserError, setUpdateUserError] = useState(null);
  const [formData, setFormData] = useState({});
  const [showModal, setShowModal] = useState(false);

  const filePickerRef = useRef();
  const dispatch = useDispatch();

  const handleOldPassword = (e) => {
    setGetOldPassword({password: e.target.value, email: currentUser.email});
  }

  const handleAuthenticatedPassword = async(e) => {
    e.preventDefault();
    setError(null);
    if(!getOldPassword || getOldPassword === ''){
      return setError('Password is required');
    }
    try {
      setError(null)
      setSuccess(null);
      const res = await fetch('/api/user/authUser', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(getOldPassword),
      });

      const data = await res.json();
      
      if(data.success === false){
        console.log(data)
        return setError(data.message);
      }

      if(res.ok){
        setFirstShowModal(false);
        setSecondShowModal(true);
        setError(null);
      }
    } catch (err) {
      setError(err.message)
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    if (imageFile) {
      uploadImage();
    }
  }, [imageFile]);

  const uploadImage = async () => {
    setImageFileUploadError(null);
    setImageFileUploadError(null);
    const storage = getStorage(app);
    const fileName = new Date().getTime() + imageFile.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImageFileUploadProgress(progress.toFixed(0));
      },
      (error) => {
        setImageFileUploadError(
          'Could not upload image (File must be less than 2MB)'
        );
        setImageFileUploadProgress(null);
        setImageFile(null);
        setImageFileUrl(null);
        setImageFileUploading(false);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageFileUrl(downloadURL);
          setFormData({ ...formData, profilePicture: downloadURL });
          setImageFileUploading(false);
        });
      }
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateUserError(null);
    setUpdateUserSuccess(null);
    if (Object.keys(formData).length === 0) {
      setUpdateUserError('No changes made');
      return;
    }
    if (imageFileUploading) {
      setUpdateUserError('Please wait for image to upload');
      return;
    }
    try {
      dispatch(updateStart());
      const res = await fetch(`/api/update/${currentUser._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        dispatch(updateFailure(data.message));
        setUpdateUserError(data.message);
      } else {
        dispatch(updateSuccess(data));
        setUpdateUserSuccess("User's profile updated successfully");
      }
    } catch (error) {
      dispatch(updateFailure(error.message));
      setUpdateUserError(error.message);
    }
  };

  const handleDeleteUser = async () => {
    setShowModal(false);
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/delete/${currentUser._id}`, {
        method: 'PUT',
      });
      const data = await res.json();
      if (!res.ok) {
        dispatch(deleteUserFailure(data.message));
      } else {
        dispatch(deleteUserSuccess(data));
      }
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignout = async () => {
    try {
      const res = await fetch('/api/signout', {
        method: 'POST',
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signoutSuccess());
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className='max-w-lg mx-auto p-3 w-full'>
      {/* Update profile header */}
      <h1 className='my-7 text-center font-semibold text-3xl'>
        Profile
      </h1>
      {/* Profile overview */}
      <div className='flex flex-col gap-4'>
        {/* Image Upload */}
        <form className='flex flex-col gap-4'>
          <input
            type='file'
            accept='image/*'
            onChange={handleImageChange}
            ref={filePickerRef}
            hidden
          />
          <div className='relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full'
          onClick={() => filePickerRef.current.click()}>
            {imageFileUploadProgress && (
            <CircularProgressbar
              value={imageFileUploadProgress || 0}
              text={`${imageFileUploadProgress}%`}
              strokeWidth={5}
              styles={{
                root: {
                  width: '100%',
                  height: '100%',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                },
                path: {
                  stroke: `rgba(62, 152, 199, ${
                    imageFileUploadProgress / 100
                  })`,
                },
              }}
            />
          )}
          <img
            src={imageFileUrl || currentUser.profilePicture}
            alt='user'
            className={`rounded-full w-full h-full object-cover border-8 border-[lightgray] ${
              imageFileUploadProgress &&
              imageFileUploadProgress < 100 &&
              'opacity-60'
            }`}
          />
          </div>
          {imageFileUploadError && (
            <Alert color='failure'>{imageFileUploadError}</Alert>
          )}
        </form>
        {/* User information */}
        <Accordion collapseAll>
          <Accordion.Panel>
            <Accordion.Title>Username</Accordion.Title>
            <Accordion.Content>
              <span>{currentUser.username}</span>
            </Accordion.Content>
          </Accordion.Panel>
          <Accordion.Panel>
            <Accordion.Title>Email</Accordion.Title>
            <Accordion.Content>
              <span>{currentUser.email}</span>
            </Accordion.Content>
          </Accordion.Panel>
          <Accordion.Panel>
            <Accordion.Title>Mobile Number</Accordion.Title>
            <Accordion.Content>
              <span>{currentUser.mobileNumber}</span>
            </Accordion.Content>
          </Accordion.Panel>
        </Accordion>
        <Button 
          gradientDuoTone={'purpleToBlue'} 
          onClick={() => {
            setFirstShowModal(true); 
            setError(null);
          }}
          outline
        >
          Update Profile
        </Button>  
      </div>
      {/* This is a modal for user authentication */}
      <Modal
        show={firstShowModal}
        onClose={() => setFirstShowModal(false)}
        popup
        size={'sm'}
      >
        <Modal.Header>
          Enter Password
        </Modal.Header>
        <form className='flex flex-col gap-2 w-80 mx-auto m-3' onSubmit={handleAuthenticatedPassword}>
          <TextInput placeholder='Password' type='password'  id='password' className='w-80' onChange={handleOldPassword}/>
          <div className='flex mx-auto gap-3'>
            <Button className='w-30' type='submit' color='green'>Submit</Button>
            <Button className='w-30' color='red' onClick={() => setFirstShowModal(false)}>Cancel</Button>
          </div>
          <span>
            {error && (
              <Alert color={'failure'} className="mt-5">
                {error}
              </Alert>
            )}
          </span>
        </form>
        
      </Modal>
      {/* This is modal for updating profile */}
      <Modal
        show={secondShowModal}
        onClose={() => {
          setSecondShowModal(false);
        }}
        popup
        size={'lg'}
      >
        <Modal.Header>
          Update Profile
        </Modal.Header>
        <div className='max-w-md mx-auto p-3 w-full'>
          <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
            <TextInput
              type="text"
              id="username"
              placeholder="Username"
              defaultValue={currentUser.username}
              onChange={handleChange}
            />
            <TextInput
              type="email"
              id="email"
              placeholder="Email"
              defaultValue={currentUser.email}
              onChange={handleChange}
            />
            <TextInput
              type="password"
              id="password"
              placeholder="Enter New Password"
              onChange={handleChange}
            />
            <TextInput
              type="text"
              id="mobileNumber"
              placeholder="Add Mobile Number"
              onChange={handleChange}
            />
            
            <Button className='w-30' type='submit' color='green'>Update</Button>
          </form>
          <div className='text-red-500 flex justify-between mt-5'>
            <span className='cursor-pointer' onClick={() => setShowModal(true)}>Delete Account</span>
            <span className='cursor-pointer' onClick={handleSignout}>Sign Out</span>
          </div>
          {updateUserSuccess && (
            <Alert color='success' className='mt-5'>
              {updateUserSuccess}
            </Alert>
          )}
          {updateUserError && (
            <Alert color='failure' className='mt-5'>
              {updateUserError}
            </Alert>
          )}
          {err && (
            <Alert color='failure' className='mt-5'>
              {err}
            </Alert>
          )}
          <Modal
            show={showModal}
            onClose={() => setShowModal(false)}
            popup
            size='md'
          >
          <Modal.Header />
          <Modal.Body>
            <div className='text-center'>
              <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
              <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>
                Are you sure you want to delete your account?
              </h3>
              <div className='flex justify-center gap-4'>
                <Button color='failure' onClick={handleDeleteUser}>
                  Yes, I'm sure
                </Button>
                <Button color='gray' onClick={() => setShowModal(false)}>
                  No, cancel
                </Button>
              </div>
            </div>
          </Modal.Body>
        </Modal>
        </div>
      </Modal>
    </div>
  );
}
