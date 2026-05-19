import myPhoto from '../../assets/5433M.png'

function About() {
  return (
    <div
      style={{
        padding: '40px',
        textAlign: 'center'
      }}
    >
      <h1>About Me</h1>

      <img
        src={myPhoto}
        alt='my photo'
        style={{
          width: '260px',
          borderRadius: '20px',
          marginTop: '20px',
          maxWidth: '90%'
        }}
      />

      <h2 style={{ marginTop: '20px' }}>
        Maor Sefti
      </h2>
        
      <p
        style={{
          maxWidth: '900px',
          margin: '30px auto',
          lineHeight: '1.8',
          fontSize: '18px'
        }}
      >
        My name is Maor Sefti, I am a
        31-year-old Full Stack Developer
        student from Beit Shemesh.
      </p>

      <p
        style={{
          maxWidth: '900px',
          margin: '30px auto',
          lineHeight: '1.8',
          fontSize: '18px'
        }}
      >
        I am passionate about modern web
        development technologies including
        React, TypeScript, Redux, APIs,
        Docker and AI integrations.
      </p>

       <p
        style={{
          maxWidth: '900px',
          margin: '30px auto',
          lineHeight: '1.8',
          fontSize: '18px'
        }}
      >
        CryptoPulse is a modern cryptocurrency
        tracking platform developed as part
        of my Full Stack studies.
      </p>

      <p
        style={{
          maxWidth: '900px',
          margin: '30px auto',
          lineHeight: '1.8',
          fontSize: '18px'
        }}
      >
        The application allows users to:
      </p>

       <ul
        style={{
          listStyle: 'none',
          lineHeight: '2',
          fontSize: '18px'
        }}
      >
        <li>
          Search cryptocurrencies instantly
        </li>

        <li>
          View detailed market information
        </li>

        <li>
          Get AI-powered recommendations
        </li>

        <li>
          Monitor selected cryptocurrencies
        </li>

        <li>
          Watch live market reports
        </li>
      </ul>

      <h2 style={{ marginTop: '40px' }}>
        Technologies Used
      </h2>

      <ul
        style={{
          listStyle: 'none',
          lineHeight: '2',
          fontSize: '18px'
        }}
      >
        <li>React</li>
        <li>TypeScript</li>
        <li>Redux Toolkit</li>
        <li>REST APIs</li>
        <li>Docker</li>
        <li>Artificial Intelligence APIs</li>
      </ul>
    </div>
  )
}

export default About