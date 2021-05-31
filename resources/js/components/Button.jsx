const buttonClass = "bg-blue-900 text-blue-100 hover:bg-blue-800 duration-100 animate-colors p-4 rounded-lg font-bold ";

const Button = ({ className, ...props }) => {
    return <button className={`${buttonClass} ${className}`} {...props}/>
}

export default Button
