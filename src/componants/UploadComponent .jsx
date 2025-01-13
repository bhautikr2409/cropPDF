import React from 'react'
import ChooseButton from './ChooseFileButton';

const UploadComponent = () => {
  return (
    <>
      <section>
        <div className='container mx-auto w-full h-full'>
          <h1 className='text-5xl font-semibold text-center mt-7'>CROP PDF</h1>

          <div className='p-2 bg-gray-700 w-full mt-7'>
            <div className='flex flex-col justify-center items-center border border-dashed bg-gray-600 border-white w-full h-full py-16 gap-5'>
              <img src="public\img\upload.png" className='w-24 h-[80px]' alt="" />
              <div className='flex flex-col justify-center items-center gap-3'>
                <ChooseButton />
                <p className='text-white font-medium'>or drop file here</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default UploadComponent;

