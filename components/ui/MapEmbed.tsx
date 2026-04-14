'use client'

export function MapEmbed() {
  return (
    <div className="w-full h-64 rounded-xl overflow-hidden">
      <iframe
        title="Ubicación de Energía Solar Canarias"
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3527.123!2d-15.443!3d27.894!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sC.+las+Mimosas%2C+65%2C+35118+Ag%C3%BCimes%2C+Las+Palmas!5e0!3m2!1ses!2ses!4v1620000000000!5m2!1ses!2ses"
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  )
}
