
export default function ContentContainer({ title,
  subtitle,
  children }) {
  return (
    <div className='w-full pb-4'>

      {title && (
        <div className="pb-5          px-3">
          <div className={`${subtitle ? `something  bg-red` : 'somethingle'}
                           ${subtitle ? `bg-black text-purple` : 'bg-white'}
                           `}>
            {title}
          </div>
          {subtitle && (
            <div className="text-xs text-gray-600 
  dark:text-purple-dark-subtext">
              {subtitle}
            </div>
          )}
        </div>
      )}

      <div className='bg-purple-25
                      dark:bg-purple-1600 rounded
                                            shadow
                      p-5'>




        <div className="mx-auto
                                                 flex
   flex-wrap justify-between  text-black  dark:text-purple-dark-text">
          {children}
        </div>
      </div>

    </div>
  )
}