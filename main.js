
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = 'F8_PLAYER'

const cd = $('.cd')

const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')

const playBtn = $('.btn-toggle-play')
const player = $('.player')

const progress = $('#progress')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')

const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')

const playlist = $('.playlist')
const app = {
  config : JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
  setConfig: function(key,value) {
    this.config[key] = value;
    localStorage.setItem(PLAYER_STORAGE_KEY,JSON.stringify(this.config))
  },
  currentIndex:0,
  isPlaying:false,
  isRandom:false,
  isRepeat:false,
  songs: [
    {
      name: 'Waiting for you',
      singer: 'Mono',
      path: '../music/song1.mkv',
      image: '../image/image1.jfif'
    },
    {
      name: 'Khuon mat dang thuong',
      singer: 'GD thai binh',
      path: '../music/song2.mkv',
      image: '../image/image2.jfif'
    },
    {
      name: 'Arcade',
      singer: 'Durcane',
      path: '../music/song3.mkv',
      image: '../image/image3.jfif'
    },
    {
      name: 'Another love',
      singer: 'Tom Odell',
      path: '../music/song4.mkv',
      image: '../image/image4.jfif'
    },
    {
      name: 'Let me down slowly',
      singer: 'Benjamin Franklin',
      path: '../music/song5.mkv',
      image: '../image/image5.jfif'
    }
  ],

  render: function () {
    const htmls = this.songs.map((song,index) => {
    return `
    <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
        <div class="thumb" style="background-image: url('${song.image}')">
    </div>
    <div class="body">
        <h3 class="title">${song.name}</h3>
        <p class="author">${song.singer}</p>
    </div>
        <div class="option">
        <i class="fas fa-ellipsis-h"></i>
    </div>
    </div>
            `
    })

    $('.playlist').innerHTML = htmls.join('')
  },

  defineProperties: function() {
    Object.defineProperty(this,'currentSong',{
        get: function() {   
            return this.songs[this.currentIndex]
        }
    })
    
  },

  handleEvents: function()
  {
    const _this = this
    const cdWidth = cd.offsetWidth
    // cd quay va dung 
    const cdThumbAnimate = cdThumb.animate([
      {
        transform: 'rotate(360deg)'
      }
    ], {
      duration:10000,
      iterations : Infinity
    })
   cdThumbAnimate.pause()


    // xu ly phong to thu nho anh nen
    document.onscroll = function() {
      const scrollTop = document.documentElement.scrollTop
      const newCdWidth = cdWidth - scrollTop

      // console.log
      cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0;
      cd.style.opacity = newCdWidth / cdWidth;
    
    }

    //xu ly khi click play 
    playBtn.onclick = function () {
      if(_this.isPlaying)
      {
        audio.pause();      
      }
      else{
        audio.play();     
      }
    }
    // khi bai hat dang duoc choi 
    audio.onplay = function () {
      _this.isPlaying = true;
      player.classList.add('playing');
      cdThumbAnimate.play();
    }

    //khi bai hat duoc pause
    audio.onpause = function () {
      _this.isPlaying = false;
      player.classList.remove('playing');
      cdThumbAnimate.pause();
    }

    // trinh tien do cua bai hat 
    audio.ontimeupdate = function () {
      if(audio.duration )
      {
        const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
        progress.value = progressPercent
      }
    }

    // xu li khi muon tua bai hat
    progress.onchange = function (e) {
        const seekTime = audio.duration / 100 * e.target.value
        audio.currentTime = seekTime
    }

    //khi muon chuyen bai hat tiep theo 
    nextBtn.onclick = function() {
      if(_this.isRandom){
        _this.playRandomSong()
      }else{   
      _this.nextSong()
     }
      audio.play()
      _this.render()
      _this.scrollToActiveSong()
    }

    // khi chuyen bai truoc do 
    prevBtn.onclick = function() {
      if(_this.isRandom){
        _this.playRandomSong()
      }else{
      _this.prevSong()
      }
      audio.play()
      _this.render()
    }

    //bat tat nut random bai hat
    randomBtn.onclick = function() {
      _this.isRandom = !_this.isRandom
      _this.setConfig('isRandom',_this.isRandom)
      randomBtn.classList.toggle('active', _this.isRandom)
      
    }
    //xu ly khi lap lai mot bai hat
    repeatBtn.onclick = function(e) {
      _this.isRepeat= !_this.isRepeat
      _this.setConfig('isRepeat',_this.isRepeat)
      repeatBtn.classList.toggle('active', _this.isRepeat)
      
    }

    //xu li next song khi audio ket thuc
    audio.onended = function() {
      if(_this.isRepeat)
      {
        audio.play()
      }
      else nextBtn.click()
    }

    // lang nghe khi click vao mot bai hat trogn play list
    playlist.onclick = function(e) {
      const songNode = e.target.closest('.song:not(.active)');
      if(songNode || e.target.closest('.option'))
      {
        // xu li khi clock vao song
         if(songNode)
         {
          
          _this.currentIndex = Number(songNode.dataset.index)
          _this.loadCurrentSong()
          _this.render()
          audio.play()
         }
         //xu ly khi click vao option
         if(e.target.closest('.option'))
         {

         }
      }
    }
  },
  scrollToActiveSong: function()  {
    setTimeout(() => {
      $('.song.active').scrollIntoView({
        behavior:'smooth',
        block:'nearest'
      })
    },500)
  },
  loadCurrentSong: function () {
    heading.textContent = this.currentSong.name
    cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
    audio.src= this.currentSong.path

    console.log(heading,cdThumb,audio)
  },
  loadConfig: function ()
  {
    this.isRandom=this.config.isRandom
    this.isRepeat=this.config.isRepeat

    //tuong tu voi
    // Object.assign(this,this.config)
  },
  nextSong: function ()
  {
    this.currentIndex++
    if(this.currentIndex >= this.songs.length)
    {
      this.currentIndex = 0
    }
    this.loadCurrentSong()
  },
  prevSong: function ()
  {
    this.currentIndex--
    if(this.currentIndex < 0)
    {
      this.currentIndex = this.songs.length - 1
    }
    this.loadCurrentSong()
  },
  playRandomSong: function ()
  {   
      let newIndex
      do {
        newIndex = Math.floor(Math.random() * this.songs.length)
      }while(this.currenIndex === newIndex)
      console.log(newIndex)
      this.currentIndex = newIndex
      this.loadCurrentSong()
  },
  
  start: function () {
    // tai cau hinh 
    this.loadConfig()

    // dinh nghia thuoc tinh cho object
    this.defineProperties();

    //lang nghe va xu ly cac su kien
    this.handleEvents();
    
    //tai thong tin bai hat dau tien vao ui khi chay
    this.loadCurrentSong();

    // render playlist
    this.render();

    // hien thi trang thai ban dau 
    randomBtn.classList.toggle('active', this.isRandom)
    repeatBtn.classList.toggle('active', this.isRepeat)
  },

}


app.start()
