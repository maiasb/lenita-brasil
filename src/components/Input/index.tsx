import './index.css'
import searchLogo from '../../assets/search.svg'

type InputProps = {
  value: string,
  placeholder?: string,
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
}

function Input({value, placeholder, onChange}:InputProps) {
  return (
    <>
      <input value={value} placeholder={placeholder} onChange={onChange} />
      <img className='search-logo' src={searchLogo} width={25}/>
    </>
  )
}

export { Input }
