const inputClass = "bg-gray-700 focus:bg-gray-600 p-4 rounded-lg";

const Input = ({ className, ...props }) => {
    return <input className={`${inputClass} ${className}`} {...props}/>
}

export default Input
