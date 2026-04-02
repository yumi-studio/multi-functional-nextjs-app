const AboutPage = async () => {
  return (
    <div className="pt-16 w-full h-full">
      <div className="p-3 w-full h-full">
        <div className="w-full h-full px-3 py-2 overflow-auto bg-black/25 border-2 border-black/50 backdrop-blur-md rounded-md">
          <div className="max-w-2xl mx-auto space-y-6">
            <h1 className="text-4xl font-bold text-gray-900">About Me</h1>
            
            <section className="space-y-3">
              <h2 className="text-2xl font-semibold text-gray-800">Hey there! 👨‍💻</h2>
              <p className="text-gray-700 leading-relaxed">
                I'm a passionate web developer who loves crafting beautiful and functional digital experiences. 
                With expertise in modern web technologies, I build scalable applications that solve real-world problems.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold text-gray-800">Beyond Code 🎨</h2>
              <p className="text-gray-700 leading-relaxed">
                When I'm not coding, you'll find me deep in the world of anime and manga. 
                There's something magical about Japanese storytelling—the art, the character development, and the cultural depth inspire my creative approach to problem-solving in web development.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold text-gray-800">Japan Connection 🗾</h2>
              <p className="text-gray-700 leading-relaxed">
                Japan fascinates me—from its rich traditions to cutting-edge technology. 
                My love for Japanese culture fuels my passion for design aesthetics and attention to detail in every project I undertake.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-800">Let's Connect</h3>
              <p className="text-gray-700">Have a project in mind? Let's build something amazing together! ✨</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AboutPage;
