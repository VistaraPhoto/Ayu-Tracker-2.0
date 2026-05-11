import { useState, useEffect } from "react";

const STORAGE_KEY = "ayu_tracker_v3";

const MOODS = [
  { id: "happy", emoji: "🌸", label: "Senang" },
  { id: "sad", emoji: "🥺", label: "Sedih" },
  { id: "anxious", emoji: "😟", label: "Cemas" },
  { id: "tired", emoji: "😴", label: "Lelah" },
  { id: "romantic", emoji: "🥰", label: "Romantis" },
  { id: "angry", emoji: "😤", label: "Emosi" },
  { id: "calm", emoji: "☁️", label: "Tenang" },
  { id: "energetic", emoji: "✨", label: "Semangat" },
];

const SYMPTOMS = [
  { id: "cramps", emoji: "🌀", label: "Kram" },
  { id: "headache", emoji: "💫", label: "Sakit Kepala" },
  { id: "bloating", emoji: "🫧", label: "Perut Kembung" },
  { id: "backpain", emoji: "🔅", label: "Sakit Pinggang" },
  { id: "nausea", emoji: "🌿", label: "Mual" },
  { id: "tender", emoji: "🌷", label: "Payudara Nyeri" },
  { id: "acne", emoji: "🌺", label: "Jerawat" },
  { id: "fatigue", emoji: "🍃", label: "Lelah Banget" },
];

const FLOW = [
  { id: "light", label: "Ringan", dots: 1 },
  { id: "medium", label: "Sedang", dots: 2 },
  { id: "heavy", label: "Deras", dots: 3 },
];

// 365 pesan harian dari Mas Bhakti - penuh kasih sayang dan menyentuh hati
const DAILY_LOVE_MESSAGES = [
  "Selamat pagi, Ayu 🌸 Mas selalu berdoa semoga harimu seindah senyumanmu.",
  "Ayu tahu nggak, setiap pagi Mas bangun, hal pertama yang Mas pikirin adalah kamu 💕",
  "Mas nggak butuh banyak kata untuk bilang betapa berartinya kamu buat Mas. Cukup tahu kamu ada 🌙",
  "Kamu itu bukan cuma pacar Mas. Kamu rumah yang selalu Mas pulangi 🏠💗",
  "Hari ini mungkin berat, tapi Mas percaya Ayu bisa lewatin semua. Mas di sini 💪🌸",
  "Jarak nggak akan pernah bisa bikin Mas lupa betapa cantiknya senyum Ayu 🥰",
  "Mas harap hari ini Ayu makan yang enak, istirahat cukup, dan tahu diri ini dicintai 💝",
  "Kalau dunia terasa melelahkan, ingat ya: Mas selalu punya tempat buat Ayu bersandar 🫂",
  "Ayu adalah jawaban dari doa yang Mas panjatkan tanpa Mas tahu kata-katanya 🌹",
  "Mas bangga sama kamu, Ayu. Bukan karena kamu sempurna, tapi karena kamu terus berjuang 💖",
  "Lihat diri kamu di cermin hari ini. Yang kamu lihat itu, Mas cintai sepenuh hati ✨",
  "Kamu nggak harus kuat terus, Yu. Sama Mas, boleh lemah. Mas sini 🤍",
  "Setiap detik berlalu, Mas makin yakin kamu adalah orang yang Mas pilih, hari ini dan seterusnya 🌸",
  "Hal kecil yang kamu lakuin — cara kamu ketawa, cara kamu peduli — semuanya bikin Mas makin sayang 💕",
  "Mas pengen kamu tahu: kamu itu lebih dari cukup. Selalu 🌷",
  "Hari ini, izinkan diri Ayu bahagia ya. Kamu layak dapat kebahagiaan terbaik 🌼",
  "Mas doakan semua yang terbaik menghampiri Ayu hari ini, tanpa Ayu minta sekalipun 🙏💗",
  "Kalau kamu ngerasa sendirian, Mas cuma mau bilang: kamu nggak pernah benar-benar sendiri 🌙",
  "Ada hal yang nggak berubah sejak Mas kenal Ayu: Mas selalu milih kamu 💝",
  "Satu hal yang Mas syukuri setiap hari adalah momen pertama kali ketemu Ayu 🌸",
  "Mas nggak bisa janjiin hidup yang sempurna, tapi Mas janjiin Ayu nggak akan sendirian 💑",
  "Kamu tau hal favorit Mas? Saat Ayu ketawa lepas. Semoga hari ini banyak hal yang bikin Ayu ketawa 😄🌸",
  "Mas mungkin jauh, tapi rasa sayang Mas dekat banget di hati Ayu 💓",
  "Jaga diri baik-baik ya, Yu. Karena dirimu itu berharga banget buat Mas 💗",
  "Hari ini, apapun yang terjadi, ingat kamu dicintai lebih dari yang kamu bayangkan 🌹",
  "Mas pengen Ayu tahu: kehadiranmu di hidup Mas itu bukan kebetulan. Ini takdir 🌙✨",
  "Kamu kuat, kamu cantik, kamu luar biasa. Dan yang terpenting: kamu milik Mas 😘💕",
  "Mas harap hari ini ada momen kecil yang bikin Ayu senyum. Mas pun akan ikut bahagia 🌸",
  "Tiap malam sebelum tidur, Mas selalu berdoa supaya Ayu dilindungi dan dibahagiakan 🙏",
  "Mas nggak pernah capek sayang sama Ayu. Nggak akan pernah 💖",
  "Pagi ini Mas kirim semangat dan cinta terbesar buat Ayu. Tolong diterima ya 🌸💕",
  "Ayu adalah keindahan yang Mas temukan di tengah kesederhanaan hidup 🌷",
  "Mas percaya, hari baik sedang dalam perjalanan menuju Ayu. Sabar ya 🌈",
  "Rasa capeknya Ayu, Mas rasain juga. Makanya Mas makin kagum sama kamu 💪🌸",
  "Kamu adalah hal terbaik yang Mas punya. Mas nggak mau ganti dengan apapun 💝",
  "Ingat ya, Ayu: jatuh itu wajar. Yang penting kamu mau bangkit lagi. Dan Mas akan selalu bantu 🫂",
  "Mas suka cara Ayu menghadapi hidup. Dengan sabar dan ikhlas. Kamu mengajarkan Mas banyak hal 🌸",
  "Hari ini Mas mau bilang terima kasih karena selalu ada. Kamu berarti banget 💗",
  "Senyum Ayu adalah hal yang paling ingin Mas lihat setiap hari 😊🌸",
  "Mas nggak perlu alasan untuk mencintaimu, karena cinta itu sendiri adalah alasannya 💖",
  "Kamu tahu nggak, Ayu? Mas bahagia cuma dengan tahu kamu baik-baik saja hari ini 🌙",
  "Mas kirim pelukan virtual yang paling hangat buat Ayu hari ini 🫂💕",
  "Setiap hal yang Ayu anggap kekurangan, Mas lihat sebagai sesuatu yang istimewa 🌸",
  "Semoga hari ini Ayu ngerasa disayang, karena memang Ayu disayang banget 💝",
  "Mas mau Ayu tahu: kamu selalu ada di pikiran dan doa Mas, setiap saat 🙏💗",
  "Hal yang paling bikin Mas tenang adalah tahu Ayu ada di dunia ini 🌍💕",
  "Kamu adalah motivasi Mas untuk jadi lebih baik setiap harinya 💪🌸",
  "Ayu, hari ini terserah kamu mau ngelakuin apa. Yang penting bahagia ya 🌼",
  "Mas cinta kamu bukan karena kamu sempurna, tapi karena kamu nyata dan apa adanya 💖",
  "Setiap hari bersama kamu, Mas belajar arti cinta yang sesungguhnya 🌸",
  "Kamu sudah cukup berjuang hari ini. Sekarang istirahatin diri, Yu 😴💕",
  "Mas harap malam ini Ayu tidur nyenyak dengan mimpi-mimpi indah 🌙✨",
  "Jaga senyum itu ya, Ayu. Dunia lebih indah kalau Ayu tersenyum 😊🌸",
  "Cinta Mas bukan cinta yang bersyarat. Apapun kondisi Ayu, Mas tetap di sini 💗",
  "Kamu kuat, Yu. Lebih kuat dari yang Ayu sendiri sadari 💪🌸",
  "Mas pengen Ayu nikmatin hari ini sepenuhnya. Tanpa beban, tanpa rasa khawatir 🌈",
  "Terima kasih sudah menjadi Ayu yang selalu Mas kenal dan cintai 💝",
  "Kamu adalah cahaya di hari-hari Mas yang gelap 🕯️💕",
  "Mas bangga punya kamu, Ayu. Sungguh bangga 🌸",
  "Hari ini mungkin biasa, tapi keberadaan Ayu bikin semuanya jadi luar biasa ✨💗",
  "Mas selalu ada, Yu. Kapanpun Ayu butuh 💑",
  "Semoga hari ini penuh dengan hal-hal kecil yang bikin Ayu tersenyum 🌸😊",
  "Mas mau Ayu tahu bahwa cinta ini tulus, dalam, dan tidak akan kemana-mana 💖",
  "Kamu adalah cerpen favorit Mas yang nggak pernah bosen Mas baca ulang 📖🌸",
  "Jangan lupa makan ya, Ayu. Mas selalu khawatir kalau kamu lupa 🍱💕",
  "Setiap hari Mas bersyukur pilihan hidup Mas jatuh pada Ayu 🙏🌸",
  "Ayu cantik hari ini? Pasti. Mas yakin tanpa harus lihat 😘💗",
  "Kamu nggak perlu jadi sempurna. Ayu apa adanya sudah cukup buat Mas 🌷",
  "Mas kirim semangat terbesar hari ini khusus buat Ayu 💪✨",
  "Ingat ya: Mas adalah tim Ayu. Selalu 🫂💕",
  "Kalau Ayu lagi sedih, izinkan Mas jadi bahu tempatmu bersandar 🤍",
  "Mas nggak pernah berhenti kagum sama Ayu yang selalu berusaha 🌸💖",
  "Satu hal yang pasti: Mas akan terus mencintai Ayu, lebih dari kemarin 💝",
  "Kamu adalah alasan terbaik Mas untuk pulang 🏠💗",
  "Ayu, hari ini sayangi diri sendiri ya, seperti Mas menyayangimu 🌸",
  "Mas percaya Ayu punya kekuatan untuk melewati apapun yang datang 💪",
  "Terima kasih sudah ada, Ayu. Itu saja sudah cukup bikin Mas bahagia 💕",
  "Mas selalu ingin Ayu tahu betapa berharganya dirimu 🌹",
  "Hari-hari bersama Ayu adalah halaman favorit di buku hidup Mas 📖✨",
  "Jangan pernah ragu untuk cerita sama Mas. Mas selalu mau dengerin 💗",
  "Kamu adalah kebaikan yang hadir di hidup Mas, dan Mas sangat bersyukur 🙏🌸",
  "Mas doakan Ayu selalu dalam lindungan dan diberikan yang terbaik 🙏💖",
  "Apapun yang terjadi hari ini, ingat: ada Mas yang selalu mendukung Ayu 💪🌸",
  "Kamu adalah melodi indah yang selalu Mas ingat bahkan saat sunyi 🎵💕",
  "Mas cinta cara Ayu menjadi dirimu sendiri. Jangan pernah berubah 🌸",
  "Ayu adalah inspirasi terbesar Mas. Kamu luar biasa 💖",
  "Hari ini Mas mau bilang: kamu sudah melakukan yang terbaik. Mas bangga 🌸",
  "Kamu tau hal yang Mas rindukan paling banyak? Ketawa bersama Ayu 😂💕",
  "Mas harap kamu ngerasa disayang hari ini, karena memang begitu adanya 💗",
  "Setiap pagi adalah kesempatan baru untuk jatuh cinta lagi sama Ayu 🌅🌸",
  "Kamu adalah bab terbaik dalam hidup Mas 📖💝",
  "Mas selalu di sini, Yu. Kemarin, hari ini, dan besok 💑",
  "Ayu adalah rumah di mana hati Mas selalu kembali 🏡💗",
  "Kamu membuat hal-hal biasa jadi luar biasa, hanya dengan keberadaanmu ✨🌸",
  "Mas mau waktu kita terus berputar begini selamanya 🌀💕",
  "Ingat, Ayu: kamu nggak harus menghadapi hari ini sendirian 🫂",
  "Senyum Ayu adalah suplemen terbaik yang Mas butuhkan setiap hari 😊💖",
  "Mas beruntung banget punya kamu. Nggak semua orang seberuntung ini 🌸",
  "Hari ini, apapun yang kamu rasakan itu valid. Dan Mas ada buat kamu 💗",
  "Kamu adalah keajaiban kecil yang Mas temukan di dunia yang besar ini 🌍🌸",
  "Mas nggak butuh alasan untuk mencintaimu. Kamu sendiri adalah alasannya 💝",
  "Ayu, jangan lupa: kamu dicintai, hari ini dan selalu 🌹💕",
  "Mas pengen jadi orang pertama yang tahu kalau Ayu sedang tidak baik-baik saja 💗",
  "Kamu telah mengajarkan Mas tentang kesabaran, kelembutan, dan cinta yang tulus 🌸",
  "Mas harap setiap langkah Ayu hari ini dipenuhi kemudahan 🙏💕",
  "Hal terbaik yang terjadi pada Mas adalah hari di mana Mas mengenal Ayu 🌸💖",
  "Kamu adalah doa Mas yang dijawab 🙏✨",
  "Mas akan selalu pilih Ayu, di setiap versi kehidupan yang ada 💑🌸",
  "Ayu, hari ini izinkan diri untuk beristirahat. Kamu sudah cukup keras bekerja 😴💗",
  "Mas kirim cinta yang paling hangat buat Ayu pagi ini ☀️💕",
  "Kamu adalah orang yang paling Mas ingin ceritakan semuanya 💬🌸",
  "Mas yakin hari ini akan baik buat Ayu. Karena kamu selalu kuat 💪💗",
  "Terima kasih sudah menjadi cahaya di hidup Mas, Ayu 🕯️🌸",
  "Mas mau Ayu tahu: kamu selalu ada di hati Mas, tanpa terkecuali 💖",
  "Semoga hari ini Ayu dikelilingi hal-hal yang membuatnya bahagia 🌸🌈",
  "Kamu adalah satu-satunya yang membuat Mas ngerasa rumah itu ada di mana pun kamu berada 🏠💗",
  "Mas sangat mencintai Ayu, lebih dari kata-kata mampu menggambarkan 💝",
  "Hari ini, jadilah baik pada dirimu sendiri ya, Ayu 🌸",
  "Mas nggak akan pernah bosan bilang: kamu luar biasa 💖",
  "Ayu adalah satu hal yang Mas syukuri setiap hari 🙏🌸",
  "Kalau dunia terasa berat, ingat Mas selalu siap berbagi bebannya 🫂💕",
  "Mas bangga dengan setiap pilihan yang Ayu buat. Kamu selalu berusaha yang terbaik 💗",
  "Kamu adalah alasan Mas tersenyum bahkan di hari yang paling sulit sekalipun 😊🌸",
  "Mas mau Ayu selalu ingat: kamu berharga, kamu dicintai, kamu penting 💝",
  "Hari ini Mas titipkan semua cinta Mas buat Ayu. Tolong dijaga ya 💕",
  "Kamu adalah ketenangan Mas di tengah segala kebisingan dunia 🌙💗",
  "Mas harap Ayu punya hari yang seindah dirinya 🌸",
  "Cinta Mas buat Ayu tumbuh setiap harinya, seperti bunga yang mekar 🌹💕",
  "Kamu adalah hal terindah yang pernah terjadi dalam hidup Mas 🌸💖",
  "Mas percaya bahwa kita diciptakan untuk saling melengkapi 💑✨",
  "Ayu, ingat selalu: kamu tidak sendirian. Mas selalu ada 🫂💗",
  "Mas mau menghabiskan setiap momen bersamamu, Ayu 🌸",
  "Kamu memberikan warna pada hari-hari Mas yang mungkin abu-abu 🎨💕",
  "Mas selalu mendoakan yang terbaik untuk Ayu, tanpa henti 🙏🌸",
  "Jangan lupa bahwa Ayu adalah prioritas Mas. Selalu 💗",
  "Kamu adalah bintang terang di langit hidup Mas ⭐💖",
  "Mas mau kamu tahu: apapun yang Ayu rasakan, Mas ingin mengerti 💝",
  "Hari ini Mas kirim semua kebaikan untuk Ayu 🌈🌸",
  "Kamu adalah alasan terbaik Mas untuk terus berjuang 💪💗",
  "Mas cinta cara Ayu melihat dunia. Selalu dengan hati yang baik 🌸",
  "Ayu adalah kehangatan di malam-malam Mas yang dingin 🔥💕",
  "Mas harap Ayu ngerasa spesial hari ini, karena memang Ayu sangat spesial 💖",
  "Kamu adalah cerita yang ingin Mas tulis seumur hidup 📝🌸",
  "Mas nggak minta kamu sempurna. Mas cuma minta kamu ada 💗",
  "Setiap hari adalah petualangan baru yang ingin Mas jalani bersamamu, Ayu 🌸✨",
  "Mas cinta semua hal tentang Ayu, bahkan hal-hal yang Ayu sendiri nggak suka 💝",
  "Kamu adalah hadiah terbaik yang Mas terima dari semesta 🎁🌸",
  "Mas akan selalu menjadi tempat teraman untuk Ayu 🫂💗",
  "Ayu, teruslah bersinar ya. Dunia butuh cahayamu ✨🌸",
  "Mas harap hari ini penuh dengan hal-hal yang membuat Ayu bersyukur 🙏💕",
  "Kamu adalah keberanian Mas untuk mencintai tanpa takut 💖",
  "Mas mau Ayu tahu: kehadiran Ayu mengubah hidup Mas menjadi lebih baik 🌸",
  "Hal yang nggak akan pernah berubah: rasa sayang Mas pada Ayu 💗",
  "Kamu adalah seni terindah yang Mas temukan 🎨💕",
  "Mas bangga kamu pilih untuk terus bangkit setiap kali jatuh 💪🌸",
  "Ayu adalah alasan Mas percaya bahwa kebaikan itu nyata 💖",
  "Mas doakan perjalanan Ayu hari ini diperlancar dan dijaga 🙏💗",
  "Kamu adalah kenangan indah yang Mas ingin bawa sampai akhir 🌸",
  "Mas mau Ayu selalu merasa didukung dan dicintai 💕",
  "Kamu adalah kebanggan Mas yang nggak pernah Mas sembunyikan 💖🌸",
  "Ayu, satu pesan dari Mas hari ini: kamu cukup. Kamu lebih dari cukup 💗",
  "Mas kirim doa terbaik untuk Ayu pagi ini. Semoga hari ini berpihak padamu 🙏🌸",
  "Kamu adalah keindahan yang membuat Mas percaya dunia ini baik 🌍💕",
  "Mas mau terus ada untuk Ayu, di setiap babak kehidupan 💑🌸",
  "Ayu adalah cahaya yang selalu Mas cari ketika gelap 🕯️💗",
  "Mas cinta cara Ayu tersenyum. Itu membuat segalanya terasa baik-baik saja 😊💖",
  "Kamu adalah tujuan Mas. Bukan hanya tujuan hidup, tapi tujuan pulang 🏡🌸",
  "Mas harap Ayu tahu seberapa besar dampak dirinya pada kehidupan Mas 💝",
  "Hari ini, nikmati setiap momennya ya, Ayu. Kamu layak mendapatkan itu 🌸",
  "Mas selalu ada di belakang Ayu, mendukung setiap langkah yang kamu ambil 💗",
  "Kamu adalah lagu yang selalu Mas hafal tanpa perlu belajar 🎵💕",
  "Mas mau Ayu tahu: cinta ini tidak akan pergi kemana-mana 💖🌸",
  "Ayu adalah matahari pagi Mas. Yang selalu bikin hari terasa hangat ☀️💗",
  "Mas nggak pernah menyesal satu detik pun memilih Ayu 💝",
  "Kamu adalah semangat Mas ketika Mas sendiri kehabisan energi 💪🌸",
  "Mas harap hari ini Ayu merasakan cinta dari semua penjuru 💕",
  "Kamu adalah angin segar di hari-hari Mas yang pengap 🌬️💗",
  "Mas mau selalu jadi yang pertama Ayu hubungi ketika butuh bantuan 📱💖",
  "Ayu, kamu adalah kebaikan yang Mas nggak pernah minta tapi selalu bersyukur atas kehadirannya 🙏🌸",
  "Mas cinta setiap versi Ayu — yang bahagia, yang sedih, yang marah, semuanya 💗",
  "Kamu adalah keajaiban dalam keseharian Mas 🌸✨",
  "Mas harap kamu bahagia hari ini, karena kamu layak mendapatkan semua kebahagiaan 💕",
  "Ayu adalah jawaban dari pertanyaan-pertanyaan Mas tentang cinta 💖",
  "Mas akan selalu bangga dengan Ayu, apapun yang terjadi 🌸💗",
  "Kamu adalah alasan Mas untuk terus memperbaiki diri 💪💝",
  "Mas mau Ayu rasakan betapa dalamnya cinta ini 💖🌸",
  "Hari ini, biarkan diri Ayu dicintai ya. Mulai dari Mas 💕",
  "Kamu adalah seluruh dunia Mas dalam satu orang 🌍💗",
  "Mas harap hari ini hanya membawa hal-hal baik untuk Ayu 🌸🌈",
  "Ayu, ingat: kamu tidak harus kuat sendirian. Ada Mas 🫂💕",
  "Mas mau Ayu tahu bahwa keberadaanmu membuat Mas menjadi versi terbaik diri Mas 💖",
  "Kamu adalah keberuntungan Mas yang paling nyata 🌸",
  "Mas selalu mendoakan kesehatan dan kebahagiaan Ayu setiap saat 🙏💗",
  "Kamu adalah semua yang Mas mau dan butuhkan 💝🌸",
  "Ayu, hari ini semoga kamu dikelilingi oleh cinta 💕",
  "Mas cinta kamu lebih dari kemarin, dan besok akan lebih dari hari ini 💖",
  "Kamu adalah ketentraman hati Mas 🌸💗",
  "Mas harap Ayu selalu ngerasa aman dan nyaman bersamaku 🫂💕",
  "Kamu adalah motivasi Mas untuk tidak pernah menyerah 💪🌸",
  "Ayu, dunia ini lebih baik karena kamu ada 🌍💖",
  "Mas mau terus belajar mencintai Ayu dengan cara yang paling benar 🌸💗",
  "Kamu adalah hal yang Mas syukuri pertama kali setiap bangun pagi 🌅💕",
  "Mas bangga dengan kamu, Ayu. Jangan pernah lupakan itu 💖🌸",
  "Ayu adalah harmoni di tengah kekacauan hidup Mas 🎵💗",
  "Mas mau Ayu tahu: tidak ada yang lebih penting dari kebahagiaanmu 💝",
  "Kamu adalah cerita yang tidak pernah Mas ingin tamatkan 📖🌸",
  "Mas cinta cara Ayu menyayangi orang-orang di sekitarnya 💕",
  "Hari ini Mas berharap Ayu bisa lihat diri sendiri seperti Mas melihatnya: luar biasa 💖🌸",
  "Kamu adalah sesuatu yang langka dan berharga, Ayu 💗",
  "Mas mau selalu ada di sisi Ayu, dalam suka maupun duka 💑🌸",
  "Ayu, ingat ya: kamu sangat dicintai 💕",
  "Mas harap mimpi Ayu semalam indah, dan hari ini lebih indah lagi 🌅💖",
  "Kamu adalah kebanggaan terbesar Mas 🌸💗",
  "Mas mau Ayu tahu bahwa setiap doa Mas selalu menyebut namamu 🙏💝",
  "Kamu adalah sumber kekuatan Mas ketika Mas merasa lemah 💪🌸",
  "Ayu, terima kasih sudah menjadi orang yang selalu membuat Mas rindu 💕",
  "Mas mau Ayu merasa dicintai setiap hari, bukan hanya hari ini 💖",
  "Kamu adalah hal paling nyata dan indah yang ada di hidup Mas 🌸💗",
  "Mas harap hari ini Ayu ngerasa seringan kapas 🌤️💕",
  "Ayu, kamu adalah keberanian Mas untuk berharap 💖🌸",
  "Mas cinta setiap cerita yang Ayu bagi sama Mas 💗",
  "Kamu adalah tempat ternyaman Mas untuk jatuh dan bangkit kembali 🫂💝",
  "Mas mau Ayu tahu: tidak ada yang bisa menggantikan posisi kamu di hati Mas 🌸",
  "Hari ini semoga Ayu diberkahi dengan momen-momen kecil yang membahagiakan 💕",
  "Kamu adalah keindahan yang membuat Mas percaya bahwa hidup ini bermakna 💖🌸",
  "Mas akan selalu menjadi orang yang paling support Ayu, tanpa syarat 💗",
  "Ayu, kamu bukan hanya pacar Mas. Kamu sahabat terbaik Mas 💑🌸",
  "Mas harap cinta ini selalu terasa nyata dan hangat buat Ayu 💕",
  "Kamu adalah semua yang baik dalam hidup Mas, terangkum jadi satu orang 💖",
  "Mas mau Ayu tahu: kamu selalu menjadi prioritas Mas 🌸💗",
  "Ayu, ingat bahwa Mas bangga dengan setiap langkah yang kamu ambil 💝",
  "Kamu adalah inspirasi Mas untuk menjadi lebih baik setiap hari 💪🌸",
  "Mas mau Ayu ngerasa dicintai, karena memang kamu sangat dicintai 💕",
  "Kamu adalah kisah yang Mas ingin ceritakan kepada dunia 📖💖",
  "Ayu, hari ini apapun yang terjadi, ingat Mas selalu ada 🫂🌸",
  "Mas cinta semua hal yang membuat Ayu menjadi dirinya sendiri 💗",
  "Kamu adalah keajaiban yang Mas tidak akan pernah bosan kagumi 🌸💝",
  "Mas harap hari ini penuh dengan kebahagiaan dan ketenangan untuk Ayu 🌈💕",
  "Ayu, kamu adalah alasan Mas percaya pada keajaiban 💖🌸",
  "Mas mau selalu menjadi orang yang membuat Ayu merasa aman 🫂💗",
  "Kamu adalah bunga terindah di taman hidup Mas 🌺🌸",
  "Mas harap semua impian Ayu segera terwujud 🌙✨💕",
  "Ayu, terima kasih sudah selalu jadi kamu. Mas cinta kamu apa adanya 💖🌸",
  "Kamu adalah bagian dari setiap doa terbaik yang Mas panjatkan 🙏💗",
  "Mas mau Ayu tahu bahwa kehadiranmu adalah berkah terbesar dalam hidup Mas 🌸💝",
  "Hari ini Mas kirim semua cinta, doa, dan semangat terbaik untuk Ayu 💕",
  "Kamu adalah keindahan yang membuat Mas ingin menjadi lebih baik setiap harinya 💖🌸",
  "Ayu, Mas akan selalu berusaha untuk membuat kamu bahagia 💑💗",
  "Kamu adalah cahaya yang selalu Mas butuhkan di ujung hari yang panjang 🕯️🌸",
  "Mas harap hari ini Ayu dikelilingi oleh kebaikan dan cinta 💕",
  "Kamu adalah pilihan yang paling benar yang pernah Mas buat 💖💗",
  "Ayu, semoga hari ini membawa senyum di wajahmu 😊🌸",
  "Mas mau Ayu tahu: cinta Mas tidak akan pernah habis 💝",
  "Kamu adalah rumah yang selalu Mas rindukan 🏡💕",
  "Mas cinta cara Ayu menjaga orang-orang yang disayanginya 🌸💖",
  "Ayu, hari ini jadilah versi terbaik dirimu. Mas percaya kamu bisa 💪💗",
  "Kamu adalah ketenangan Mas di tengah badai kehidupan 🌊🌸",
  "Mas harap Ayu selalu diberi kekuatan untuk menghadapi setiap hari 🙏💕",
  "Kamu adalah bagian dari jati diri Mas sekarang 💖🌸",
  "Ayu, ingat: Mas mencintaimu bukan karena terpaksa, tapi karena memilih 💗",
  "Mas mau kamu tahu bahwa kamu membuat dunia Mas menjadi lebih cerah ☀️🌸",
  "Kamu adalah melodiku, Ayu. Yang selalu Mas senandungkan dalam hati 🎵💕",
  "Mas harap hari ini semua hal berjalan sesuai harapan Ayu 🌈💖",
  "Ayu, kamu adalah alasan Mas bersyukur setiap pagi 🙏🌸",
  "Kamu adalah tempat Mas kembali ketika kehilangan arah 🧭💗",
  "Mas mau Ayu merasa dicintai sepenuhnya, setiap hari 💝🌸",
  "Kamu adalah keindahan yang tidak perlu dibandingkan dengan apapun 💕",
  "Ayu, hari ini Mas mau bilang: kamu adalah yang terbaik 💖🌸",
  "Mas akan selalu ada sebagai support system terkuat Ayu 💪💗",
  "Kamu adalah cinta tulus yang Mas tidak akan pernah sia-siakan 🌸💝",
  "Mas harap hari ini Ayu merasakan betapa disayang dirinya 💕",
  "Ayu, kamu adalah keajaiban yang membuat Mas percaya pada takdir ✨🌸",
  "Mas mau Ayu tahu: setiap momen bersamamu adalah momen yang Mas hargai 💖💗",
  "Kamu adalah semua yang Mas butuhkan untuk merasa lengkap 🌸",
  "Mas cinta cara Ayu menghadapi hidup dengan penuh semangat 💪💕",
  "Ayu, semoga hari ini membawa kedamaian dan kebahagiaan untukmu 🌸💖",
  "Kamu adalah keberuntungan yang Mas syukuri setiap detik 🙏💗",
  "Mas mau Ayu tahu bahwa cinta ini nyata, dalam, dan abadi 💝🌸",
  "Kamu adalah hal terbaik yang pernah terjadi dalam hidup Mas 💕",
  "Ayu, ingat bahwa Mas bangga menjadi orang yang Ayu percaya 💖🌸",
  "Mas harap hari ini penuh dengan momen-momen berharga untuk Ayu 💗",
  "Kamu adalah peta Mas menuju kebahagiaan 🗺️🌸",
  "Mas mau selalu menjadi bagian dari hidup Ayu, di setiap babaknya 💑💕",
  "Ayu, kamu adalah jawaban terbaik dari semua pertanyaan Mas 💖",
  "Kamu adalah semangat pagi Mas yang tidak pernah padam ☀️🌸💗",
  "Mas cinta cara Ayu mencintai. Tulus, hangat, dan penuh perhatian 💝",
  "Ayu, hari ini Mas kirim semua doa terbaik khusus untukmu 🙏💕",
  "Kamu adalah kebaikan yang Mas tidak pernah minta tapi selalu bersyukur mendapatkannya 🌸💖",
  "Mas mau Ayu selalu tahu bahwa kamu tidak pernah berjuang sendirian 🫂💗",
  "Kamu adalah matahari yang membuat hari Mas selalu cerah ☀️🌸",
  "Ayu, semoga hari ini lebih baik dari kemarin dan lebih indah dari biasanya 🌈💕",
  "Mas harap Ayu selalu merasakan cinta Mas, bahkan di saat Mas tidak ada 💖🌸",
  "Kamu adalah kisah cinta terbaik yang pernah Mas alami 💗",
  "Ayu, kamu adalah hadiah dari langit yang Mas jaga sepenuh hati 🎁🌸💝",
  "Mas mau Ayu tahu: selama Mas ada, kamu tidak perlu khawatir 🫂💕",
  "Kamu adalah alasan Mas untuk terus percaya bahwa cinta itu indah 💖🌸",
  "Ayu, hari ini jadilah baik pada dirimu sendiri. Kamu layak mendapatkan itu 💗",
  "Mas harap kamu merasa dicintai oleh seluruh alam semesta hari ini 🌍💕",
  "Kamu adalah keindahan yang tidak pernah pudar di mata Mas 🌸💖",
  "Mas mau Ayu tahu bahwa kamu sangat berharga bagi Mas 💝",
  "Ayu, semoga hari ini penuh dengan keajaiban kecil yang menyenangkan ✨🌸💗",
  "Kamu adalah cahaya yang tidak pernah redup di hidup Mas 🕯️💕",
  "Mas cinta kamu kemarin, hari ini, dan selamanya 💖🌸",
  "Ayu, ingat bahwa keberadaanmu membuat dunia ini lebih baik 🌍💗",
  "Kamu adalah pilihan hati Mas yang tidak pernah Mas sesali 🌸💝",
  "Mas harap hari ini Ayu dikelilingi oleh orang-orang yang menyayanginya 💕",
  "Kamu adalah ketenangan jiwa Mas 🌸💖",
  "Ayu, Mas mau kamu tahu: kamu adalah satu-satunya yang ada di hati Mas 💗",
  "Mas mau selalu menjadi alasan Ayu tersenyum, setiap harinya 😊🌸💕",
  "Kamu adalah keindahan yang membuat Mas selalu kagum 💖🌸",
  "Ayu, hari ini semoga semua yang baik menemanimu 🌈💗",
  "Mas cinta cara Ayu membuat segalanya terasa lebih bermakna 🌸💝",
  "Kamu adalah doa Mas yang terjawab dengan sempurna 🙏💕",
  "Ayu, kamu adalah yang terbaik. Jangan pernah lupa itu 💖🌸",
  "Mas harap hari ini Ayu merasakan kebahagiaan yang sesungguhnya 💗",
  "Kamu adalah segalanya bagi Mas, Ayu 🌸💝",
  "Mas mau Ayu tahu bahwa cinta ini tidak mengenal batas 💕",
  "Ayu, semoga hari ini penuh dengan cinta dan kebahagiaan yang melimpah 💖🌸",
];

const HEALTH_TIPS = {
  period: [
    { emoji: "🌡️", title: "Kompres Hangat", tip: "Tempelkan botol air hangat atau heating pad di perut bawah selama 15-20 menit untuk meredakan kram." },
    { emoji: "🍵", title: "Teh Jahe & Chamomile", tip: "Minum teh jahe atau chamomile hangat 2-3x sehari. Kandungan anti-inflamasinya membantu meredakan nyeri dan kram." },
    { emoji: "🍫", title: "Dark Chocolate", tip: "Konsumsi dark chocolate 70%+ untuk meningkatkan endorfin dan kadar magnesium yang membantu meredakan kram." },
    { emoji: "🏃‍♀️", title: "Gerak Ringan", tip: "Jalan kaki santai 10-15 menit atau yoga ringan bisa membantu mengurangi nyeri lebih baik dari berbaring terus." },
    { emoji: "💧", title: "Hidrasi Ekstra", tip: "Minum minimal 8-10 gelas air putih per hari. Dehidrasi dapat memperburuk kram dan sakit kepala saat haid." },
    { emoji: "🥗", title: "Anti-Inflamasi", tip: "Perbanyak omega-3 (ikan salmon, kacang-kacangan) dan kurangi makanan asin & berlemak untuk mengurangi peradangan." },
  ],
  pms: [
    { emoji: "🧘‍♀️", title: "Kelola Stres", tip: "Praktikkan napas dalam 5-5-5: hirup 5 detik, tahan 5 detik, hembuskan 5 detik. Lakukan 5 kali saat PMS menyerang." },
    { emoji: "🌙", title: "Tidur Teratur", tip: "Kurang tidur memperburuk gejala PMS. Usahakan tidur 7-9 jam pada waktu yang sama setiap malam." },
    { emoji: "☕", title: "Kurangi Kafein", tip: "Kafein bisa memperburuk nyeri payudara dan kecemasan. Ganti kopi dengan teh herbal atau air lemon hangat." },
    { emoji: "🍌", title: "Magnesium & B6", tip: "Konsumsi pisang, alpukat, dan kacang-kacangan. Magnesium dan vitamin B6 terbukti mengurangi gejala PMS." },
    { emoji: "🚶‍♀️", title: "Olahraga Ringan", tip: "Jalan santai 20-30 menit melepaskan endorfin yang membantu mengatasi mood swing dan kecemasan saat PMS." },
    { emoji: "💆‍♀️", title: "Pijat & Relaksasi", tip: "Pijat lembut area perut bawah, punggung bawah, dan kaki bisa sangat membantu meredakan ketidaknyamanan PMS." },
  ],
  fertile: [
    { emoji: "🥦", title: "Nutrisi Folat", tip: "Konsumsi sayuran hijau gelap (bayam, brokoli) yang kaya folat. Penting untuk kesehatan reproduksi dan hormonal." },
    { emoji: "🏋️‍♀️", title: "Olahraga Optimal", tip: "Fase subur adalah waktu terbaik untuk olahraga intensitas sedang-tinggi karena energi dan daya tahan tubuh sedang puncaknya." },
    { emoji: "🫐", title: "Antioksidan", tip: "Perbanyak buah beri, kacang-kacangan, dan sayuran berwarna. Antioksidan mendukung kualitas hormon di fase subur." },
    { emoji: "😴", title: "Kualitas Tidur", tip: "Kualitas tidur mempengaruhi kesehatan hormonal. Buat rutinitas tidur yang konsisten untuk siklus yang lebih sehat." },
  ],
  ovulation: [
    { emoji: "✨", title: "Puncak Energi", tip: "Hari ovulasi biasanya adalah saat energi dan mood paling tinggi. Manfaatkan untuk aktivitas kreatif atau produktif." },
    { emoji: "🩸", title: "Kenali Tandanya", tip: "Lendir serviks jernih dan elastis seperti putih telur mentah adalah tanda ovulasi yang normal dan sehat." },
    { emoji: "🌡️", title: "Suhu Basal", tip: "Suhu tubuh naik sedikit (0.2-0.5°C) saat ovulasi. Mengukur suhu basal setiap pagi bisa membantu memahami siklus." },
  ],
  normal: [
    { emoji: "🔄", title: "Jaga Siklus Teratur", tip: "Tidur cukup, makan teratur, dan kelola stres adalah tiga pilar utama menjaga siklus haid yang sehat dan teratur." },
    { emoji: "⚖️", title: "Berat Badan Sehat", tip: "Berat badan terlalu rendah atau terlalu tinggi bisa mengganggu siklus. Jaga pola makan seimbang dan olahraga rutin." },
    { emoji: "📱", title: "Catat Siklusmu", tip: "Mencatat siklus membantu mengenali pola dan perubahan. Konsistenlah mencatat agar prediksi semakin akurat." },
    { emoji: "🩺", title: "Periksa Rutin", tip: "Jika siklus sering tidak teratur (< 21 hari atau > 35 hari), konsultasikan dengan dokter untuk pemeriksaan hormonal." },
  ],
};

const WATER_GOAL = 8;

function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const defaults = {
      periods: [], logs: {}, cycleLength: 28,
      boyfriendMessages: [], partnerName: "Mas Bhakti",
      waterToday: { date: "", count: 0 },
      vitamins: { date: "", taken: false },
    };
    return raw ? { ...defaults, ...JSON.parse(raw) } : defaults;
  } catch {
    return { periods: [], logs: {}, cycleLength: 28, boyfriendMessages: [], partnerName: "Mas Bhakti", waterToday: { date: "", count: 0 }, vitamins: { date: "", taken: false } };
  }
}

function saveData(data) { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); }

function getDaysInMonth(y, m) { return new Date(y, m + 1, 0).getDate(); }
function getFirstDayOfMonth(y, m) { return new Date(y, m, 1).getDay(); }
function toDateKey(y, m, d) { return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`; }

function predictNextPeriods(periods, cycleLength) {
  if (!periods.length) return [];
  const sorted = [...periods].sort((a, b) => new Date(a) - new Date(b));
  const last = new Date(sorted[sorted.length - 1]);
  return [1, 2, 3].map(i => { const d = new Date(last); d.setDate(d.getDate() + cycleLength * i); return d; });
}

function getPeriodDates(periods) {
  const set = new Set();
  periods.forEach(p => {
    for (let i = 0; i < 5; i++) {
      const d = new Date(p); d.setDate(d.getDate() + i);
      set.add(d.toISOString().split("T")[0]);
    }
  });
  return set;
}

function analyzeCycle(periods, cycleLength) {
  if (periods.length < 2) return null;
  const sorted = [...periods].sort((a, b) => new Date(a) - new Date(b));
  const gaps = [];
  for (let i = 1; i < sorted.length; i++) {
    gaps.push(Math.round((new Date(sorted[i]) - new Date(sorted[i - 1])) / (1000 * 60 * 60 * 24)));
  }
  const avg = Math.round(gaps.reduce((a, b) => a + b, 0) / gaps.length);
  const last = gaps[gaps.length - 1];
  const diff = last - cycleLength;
  let status = "normal", conclusion = "", suggestion = "";
  if (Math.abs(diff) <= 3) {
    status = "normal"; conclusion = "Siklus haidmu sangat teratur! 🌸";
    suggestion = "Pertahankan pola tidur & makan yang sehat ya.";
  } else if (diff > 3 && diff <= 7) {
    status = "late"; conclusion = `Siklus terakhir lebih panjang ${diff} hari dari biasanya.`;
    suggestion = "Bisa karena stres, kurang tidur, atau perubahan pola makan. Jangan terlalu khawatir ya 💕";
  } else if (diff > 7) {
    status = "very_late"; conclusion = `Siklus terakhir terlambat ${diff} hari dari biasanya.`;
    suggestion = "Kalau sudah lebih dari 45 hari, ada baiknya konsultasi ke dokter ya sayang 🩺";
  } else if (diff < -3 && diff >= -7) {
    status = "early"; conclusion = `Siklus terakhir lebih cepat ${Math.abs(diff)} hari dari biasanya.`;
    suggestion = "Siklus yang lebih pendek bisa karena aktivitas fisik intens atau perubahan hormonal ringan.";
  } else {
    status = "very_early"; conclusion = `Siklus terakhir lebih cepat ${Math.abs(diff)} hari dari biasanya.`;
    suggestion = "Kalau terus berlanjut, ada baiknya dicatat dan dikonsultasikan ke dokter 🩺";
  }
  return { avg, last, diff, status, conclusion, suggestion, total: periods.length };
}

function getDaysUntil(month, day) {
  const now = new Date();
  const target = new Date(now.getFullYear(), month - 1, day);
  if (target < now) target.setFullYear(now.getFullYear() + 1);
  return Math.ceil((target - now) / 86400000);
}

export default function App() {
  const [data, setData] = useState(loadData);
  const [tab, setTab] = useState("home");
  const today = new Date();
  const todayStr = toDateKey(today.getFullYear(), today.getMonth(), today.getDate());
  const [calMonth, setCalMonth] = useState(today.getMonth());
  const [calYear, setCalYear] = useState(today.getFullYear());
  const [logModal, setLogModal] = useState(false);
  const [logDate, setLogDate] = useState(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [newMsg, setNewMsg] = useState({ text: "", phase: "period", emoji: "💕" });
  const [notification, setNotification] = useState(null);

  useEffect(() => { saveData(data); }, [data]);

  // Reset water & vitamin daily
  useEffect(() => {
    if (data.waterToday.date !== todayStr) {
      setData(d => ({ ...d, waterToday: { date: todayStr, count: 0 } }));
    }
    if (data.vitamins.date !== todayStr) {
      setData(d => ({ ...d, vitamins: { date: todayStr, taken: false } }));
    }
  }, []);

  const showNotif = (msg) => { setNotification(msg); setTimeout(() => setNotification(null), 2500); };

  const todayKey = toDateKey(today.getFullYear(), today.getMonth(), today.getDate());
  const periodDates = getPeriodDates(data.periods);
  const predictions = predictNextPeriods(data.periods, data.cycleLength);
  const predDates = getPeriodDates(predictions.map(d => d.toISOString()));

  const sorted = [...data.periods].sort((a, b) => new Date(b) - new Date(a));
  const lastPeriod = sorted[0] ? new Date(sorted[0]) : null;
  const nextPeriod = predictions[0];
  const daysUntilNext = nextPeriod ? Math.ceil((nextPeriod - today) / 86400000) : null;
  const isOnPeriod = periodDates.has(todayKey);
  const dayOfCycle = lastPeriod ? Math.floor((today - lastPeriod) / 86400000) + 1 : null;

  let phase = "normal";
  if (isOnPeriod) phase = "period";
  else if (dayOfCycle) {
    const half = data.cycleLength / 2;
    if (dayOfCycle >= half - 3 && dayOfCycle <= half + 1) phase = "fertile";
    if (dayOfCycle === Math.floor(half)) phase = "ovulation";
    if (daysUntilNext && daysUntilNext <= 5) phase = "pms";
  }

  const phaseConfig = {
    period: { emoji: "🌸", label: "Lagi Haid", color: "#e91e8c", bg: "linear-gradient(135deg,#f06292,#e91e8c)" },
    fertile: { emoji: "🌿", label: "Masa Subur", color: "#43a047", bg: "linear-gradient(135deg,#a5d6a7,#43a047)" },
    ovulation: { emoji: "✨", label: "Ovulasi", color: "#7b1fa2", bg: "linear-gradient(135deg,#ce93d8,#7b1fa2)" },
    pms: { emoji: "🌺", label: "Hampir Haid", color: "#f06292", bg: "linear-gradient(135deg,#f8bbd0,#f06292)" },
    normal: { emoji: "🌙", label: "Hari Biasa", color: "#e91e8c", bg: "linear-gradient(135deg,#f48fb1,#e91e8c)" },
  };
  const pc = phaseConfig[phase];

  // Daily love message - unique per day of year
  const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 86400000);
  const dailyLoveMsg = DAILY_LOVE_MESSAGES[dayOfYear % DAILY_LOVE_MESSAGES.length];

  const analysis = analyzeCycle(data.periods, data.cycleLength);
  const healthTips = HEALTH_TIPS[phase] || HEALTH_TIPS.normal;

  // Birthdays
  const daysToAyuBday = getDaysUntil(12, 28);
  const daysToBhaktiBday = getDaysUntil(2, 22);
  const isAyuBday = today.getMonth() === 11 && today.getDate() === 28;
  const isBhaktiBday = today.getMonth() === 1 && today.getDate() === 22;

  const togglePeriod = (dateKey) => {
    const exists = data.periods.includes(dateKey);
    setData(d => ({ ...d, periods: exists ? d.periods.filter(p => p !== dateKey) : [...d.periods, dateKey] }));
    showNotif(exists ? "Tanda haid dihapus 🌿" : "Hari pertama haid ditandai 🌸");
  };

  const updateLog = (field, value) => {
    setData(d => ({ ...d, logs: { ...d.logs, [logDate]: { ...(d.logs[logDate] || {}), [field]: value } } }));
  };
  const toggleArrayLog = (field, value) => {
    const cur = (data.logs[logDate] || {})[field] || [];
    updateLog(field, cur.includes(value) ? cur.filter(x => x !== value) : [...cur, value]);
  };
  const currentLog = logDate ? data.logs[logDate] || {} : {};

  const MONTHS = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];
  const daysInMonth = getDaysInMonth(calYear, calMonth);
  const firstDay = getFirstDayOfMonth(calYear, calMonth);

  const getDayStatus = (key) => {
    // Birthday markers
    const d = new Date(key + "T00:00:00");
    if (d.getMonth() === 11 && d.getDate() === 28) return "birthday_ayu";
    if (d.getMonth() === 1 && d.getDate() === 22) return "birthday_bhakti";
    if (periodDates.has(key)) return "period";
    if (predDates.has(key)) return "predicted";
    if (lastPeriod) {
      const diff = Math.floor((d - lastPeriod) / 86400000);
      const half = data.cycleLength / 2;
      if (diff === Math.floor(half)) return "ovulation";
      if (diff >= half - 3 && diff <= half + 1) return "fertile";
    }
    return null;
  };

  const addBfMessage = () => {
    if (!newMsg.text.trim()) return;
    setData(d => ({ ...d, boyfriendMessages: [...(d.boyfriendMessages || []), { ...newMsg, id: Date.now() }] }));
    setNewMsg({ text: "", phase: "period", emoji: "💕" });
    showNotif("Pesan tersimpan 💕");
  };
  const deleteBfMsg = (id) => setData(d => ({ ...d, boyfriendMessages: d.boyfriendMessages.filter(m => m.id !== id) }));

  const addWater = () => {
    if (data.waterToday.count >= WATER_GOAL) return;
    setData(d => ({ ...d, waterToday: { date: todayStr, count: d.waterToday.count + 1 } }));
    if (data.waterToday.count + 1 === WATER_GOAL) showNotif("🎉 Target minum air tercapai!");
  };
  const removeWater = () => {
    if (data.waterToday.count <= 0) return;
    setData(d => ({ ...d, waterToday: { date: todayStr, count: d.waterToday.count - 1 } }));
  };
  const toggleVitamin = () => {
    setData(d => ({ ...d, vitamins: { date: todayStr, taken: !d.vitamins.taken } }));
    showNotif(data.vitamins.taken ? "Vitamin belum diminum 🌿" : "Vitamin sudah diminum! 💊");
  };

  const s = {
    app: { minHeight: "100vh", width: "100%", maxWidth: "100vw", background: "linear-gradient(160deg,#fff0f5,#fce4ec,#f8bbd0)", fontFamily: "'Nunito',sans-serif", paddingBottom: 72, boxSizing: "border-box", overflowX: "hidden" },
    header: { background: "linear-gradient(135deg,#f48fb1,#e91e8c)", padding: "16px 16px 14px", display: "flex", alignItems: "center", justifyContent: "space-between", boxShadow: "0 4px 20px rgba(233,30,140,.25)", position: "sticky", top: 0, zIndex: 50 },
    headerTitle: { color: "#fff", fontSize: 18, fontWeight: 800 },
    headerSub: { color: "rgba(255,255,255,.85)", fontSize: 11, marginTop: 2 },
    avatar: { width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,.25)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, cursor: "pointer", border: "2px solid rgba(255,255,255,.5)", flexShrink: 0 },
    nav: { position: "fixed", bottom: 0, left: 0, right: 0, background: "#fff", borderTop: "1px solid #fce4ec", display: "flex", zIndex: 100, boxShadow: "0 -4px 20px rgba(244,143,177,.15)" },
    navBtn: (a) => ({ flex: 1, padding: "8px 0 6px", display: "flex", flexDirection: "column", alignItems: "center", gap: 1, background: "none", border: "none", cursor: "pointer", color: a ? "#e91e8c" : "#bbb", fontSize: 9, fontWeight: a ? 700 : 500, fontFamily: "'Nunito',sans-serif" }),
    card: { background: "#fff", borderRadius: 20, padding: "16px", margin: "10px 12px", boxShadow: "0 4px 20px rgba(244,143,177,.15)" },
    cardTitle: { fontSize: 11, color: "#e91e8c", fontWeight: 700, marginBottom: 10, textTransform: "uppercase", letterSpacing: .8 },
    circle: { width: 110, height: 110, borderRadius: "50%", background: pc.bg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", margin: "0 auto 14px", boxShadow: `0 8px 30px ${pc.color}66` },
    chip: (a) => ({ padding: "6px 12px", borderRadius: 20, border: `1.5px solid ${a ? "#e91e8c" : "#fce4ec"}`, background: a ? "linear-gradient(135deg,#fce4ec,#f8bbd0)" : "#fff", color: a ? "#c2185b" : "#aaa", fontSize: 12, fontWeight: a ? 700 : 500, cursor: "pointer" }),
    btn: (v) => ({ padding: "11px 24px", borderRadius: 14, border: "none", fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: 14, cursor: "pointer", background: v === "primary" ? "linear-gradient(135deg,#f06292,#e91e8c)" : v === "danger" ? "linear-gradient(135deg,#ef9a9a,#e57373)" : "#fce4ec", color: v === "ghost" ? "#e91e8c" : "#fff" }),
    modal: { position: "fixed", inset: 0, background: "rgba(194,24,91,.15)", backdropFilter: "blur(6px)", zIndex: 200, display: "flex", alignItems: "flex-end", justifyContent: "center" },
    modalBox: { background: "#fff", borderRadius: "24px 24px 0 0", padding: "22px 16px 36px", width: "100%", maxWidth: "100vw", maxHeight: "88vh", overflowY: "auto", boxSizing: "border-box" },
    sLabel: { fontSize: 12, fontWeight: 700, color: "#e91e8c", marginBottom: 8, marginTop: 14 },
    notif: { position: "fixed", top: 70, left: "50%", transform: "translateX(-50%)", background: "linear-gradient(135deg,#f06292,#e91e8c)", color: "#fff", padding: "9px 20px", borderRadius: 20, fontWeight: 700, fontSize: 13, zIndex: 300, boxShadow: "0 4px 20px rgba(233,30,140,.3)", whiteSpace: "nowrap" },
    row: { display: "flex", gap: 8 },
    insightCard: (c) => ({ flex: 1, background: c, borderRadius: 14, padding: "12px 10px", textAlign: "center" }),
    statusBadge: (c) => ({ display: "inline-block", padding: "3px 10px", borderRadius: 10, background: c, color: "#fff", fontSize: 11, fontWeight: 700 }),
  };

  const BOYFRIEND_TRIGGERS = [
    { phase: "period", label: "Saat haid" },
    { phase: "pms", label: "Saat PMS" },
    { phase: "ovulation", label: "Masa subur" },
    { phase: "any", label: "Setiap hari" },
  ];

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      <div style={s.app}>
        {/* HEADER */}
        <div style={s.header}>
          <div>
            <div style={s.headerTitle}>🌸 Halo, Ayu!</div>
            <div style={s.headerSub}>Tracker haid cantikmu 💕</div>
          </div>
          <div style={s.avatar} onClick={() => setSettingsOpen(true)}>⚙️</div>
        </div>

        {notification && <div style={s.notif}>{notification}</div>}

        {/* ===== HOME ===== */}
        {tab === "home" && (
          <>
            {/* Birthday banners */}
            {isAyuBday && (
              <div style={{ ...s.card, background: "linear-gradient(135deg,#ff6b9d,#c44569)", textAlign: "center", padding: "20px 16px" }}>
                <div style={{ fontSize: 40 }}>🎂🎉</div>
                <div style={{ fontSize: 18, fontWeight: 900, color: "#fff", marginTop: 8 }}>Selamat Ulang Tahun, Ayu!</div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,.9)", marginTop: 6 }}>Semoga hari ini jadi hari paling indah. Mas Bhakti cinta kamu sepenuh hati 💕</div>
              </div>
            )}
            {isBhaktiBday && (
              <div style={{ ...s.card, background: "linear-gradient(135deg,#a18cd1,#fbc2eb)", textAlign: "center", padding: "20px 16px" }}>
                <div style={{ fontSize: 40 }}>🎂✨</div>
                <div style={{ fontSize: 18, fontWeight: 900, color: "#fff", marginTop: 8 }}>Hari ini Ulang Tahun Mas Bhakti!</div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,.9)", marginTop: 6 }}>Semoga Mas selalu sehat, bahagia, dan terus menyayangi Ayu 💗</div>
              </div>
            )}

            {/* Countdown birthdays */}
            {!isAyuBday && !isBhaktiBday && (
              <div style={{ ...s.card, background: "linear-gradient(135deg,#fce4ec,#fff0f5)" }}>
                <div style={s.cardTitle}>🎂 Countdown Hari Spesial</div>
                <div style={{ display: "flex", gap: 10 }}>
                  <div style={{ flex: 1, background: "linear-gradient(135deg,#f06292,#e91e8c)", borderRadius: 14, padding: "12px 10px", textAlign: "center" }}>
                    <div style={{ fontSize: 24, fontWeight: 900, color: "#fff" }}>{daysToAyuBday}</div>
                    <div style={{ fontSize: 10, color: "rgba(255,255,255,.9)", fontWeight: 700 }}>hari lagi</div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,.85)", marginTop: 2 }}>🎂 Ultah Ayu</div>
                    <div style={{ fontSize: 10, color: "rgba(255,255,255,.7)" }}>28 Desember</div>
                  </div>
                  <div style={{ flex: 1, background: "linear-gradient(135deg,#a18cd1,#fbc2eb)", borderRadius: 14, padding: "12px 10px", textAlign: "center" }}>
                    <div style={{ fontSize: 24, fontWeight: 900, color: "#fff" }}>{daysToBhaktiBday}</div>
                    <div style={{ fontSize: 10, color: "rgba(255,255,255,.9)", fontWeight: 700 }}>hari lagi</div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,.85)", marginTop: 2 }}>🎂 Ultah Mas Bhakti</div>
                    <div style={{ fontSize: 10, color: "rgba(255,255,255,.7)" }}>22 Februari</div>
                  </div>
                </div>
              </div>
            )}

            {/* Phase card */}
            <div style={{ ...s.card, textAlign: "center", paddingTop: 20 }}>
              <div style={s.circle}>
                <div style={{ fontSize: 30 }}>{pc.emoji}</div>
                {dayOfCycle && <><div style={{ fontSize: 22, fontWeight: 900, color: "#fff", lineHeight: 1 }}>{dayOfCycle}</div><div style={{ fontSize: 10, color: "rgba(255,255,255,.9)", fontWeight: 600 }}>Hari ke</div></>}
              </div>
              <div style={{ fontSize: 16, fontWeight: 800, color: "#c2185b" }}>{pc.label}</div>
              <div style={{ fontSize: 12, color: "#f48fb1", marginTop: 4 }}>
                {daysUntilNext != null ? daysUntilNext > 0 ? `Haid berikutnya dalam ${daysUntilNext} hari` : "Waktunya haid nih! 🌸" : "Tandai haid pertamamu di Kalender"}
              </div>
              <button style={{ ...s.btn("ghost"), marginTop: 12, width: "100%" }} onClick={() => { setLogDate(todayKey); setLogModal(true); }}>
                📝 Catat Hari Ini
              </button>
            </div>

            {/* Daily love message from Mas Bhakti */}
            <div style={{ ...s.card, background: "linear-gradient(135deg,#fce4ec,#fff0f5)", border: "1.5px solid #f8bbd0" }}>
              <div style={s.cardTitle}>💌 Pesan Mas Bhakti Hari Ini</div>
              <div style={{ fontSize: 14, color: "#c2185b", fontWeight: 600, lineHeight: 1.6, fontStyle: "italic" }}>
                "{dailyLoveMsg}"
              </div>
              <div style={{ fontSize: 11, color: "#f48fb1", marginTop: 8, textAlign: "right" }}>— Mas Bhakti 💕</div>
            </div>

            {/* Nasihat Kesehatan Siklus */}
            <div style={{ ...s.card }}>
              <div style={s.cardTitle}>🩺 Nasihat Kesehatan Siklus</div>
              <div style={{ fontSize: 12, color: "#f48fb1", marginBottom: 10, fontWeight: 600 }}>
                {phase === "period" && "🌸 Kamu sedang haid — ini tips untukmu:"}
                {phase === "pms" && "🌺 Kamu hampir haid (PMS) — jaga dirimu:"}
                {phase === "fertile" && "🌿 Kamu di masa subur — optimalkan kesehatanmu:"}
                {phase === "ovulation" && "✨ Kamu sedang ovulasi — ketahui tandanya:"}
                {phase === "normal" && "🌙 Hari biasa — jaga kesehatan siklus:"}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {healthTips.map((tip, i) => (
                  <div key={i} style={{ background: "#fce4ec", borderRadius: 12, padding: "10px 12px", display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <span style={{ fontSize: 20, flexShrink: 0 }}>{tip.emoji}</span>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 800, color: "#c2185b", marginBottom: 2 }}>{tip.title}</div>
                      <div style={{ fontSize: 11, color: "#888", lineHeight: 1.5 }}>{tip.tip}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Water & Vitamin tracker */}
            <div style={s.card}>
              <div style={s.cardTitle}>💧 Pengingat Harian</div>
              {/* Water */}
              <div style={{ marginBottom: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#c2185b" }}>💧 Minum Air Putih</div>
                  <div style={{ fontSize: 12, color: "#f48fb1", fontWeight: 600 }}>{data.waterToday.count}/{WATER_GOAL} gelas</div>
                </div>
                <div style={{ display: "flex", gap: 5, marginBottom: 8, flexWrap: "wrap" }}>
                  {Array(WATER_GOAL).fill(null).map((_, i) => (
                    <div key={i} style={{ width: 28, height: 28, borderRadius: 8, background: i < data.waterToday.count ? "linear-gradient(135deg,#64b5f6,#1565c0)" : "#fce4ec", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, transition: "all 0.2s" }}>
                      {i < data.waterToday.count ? "💧" : "○"}
                    </div>
                  ))}
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button style={{ ...s.btn("primary"), flex: 1, padding: "9px", fontSize: 13 }} onClick={addWater}>+ Minum Segelas</button>
                  <button style={{ ...s.btn("ghost"), padding: "9px 14px", fontSize: 13 }} onClick={removeWater}>−</button>
                </div>
                {data.waterToday.count >= WATER_GOAL && (
                  <div style={{ marginTop: 8, textAlign: "center", fontSize: 12, color: "#1565c0", fontWeight: 700 }}>🎉 Target minum air hari ini tercapai!</div>
                )}
              </div>
              {/* Vitamin */}
              <div style={{ borderTop: "1px solid #fce4ec", paddingTop: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#c2185b" }}>💊 Vitamin Harian</div>
                    <div style={{ fontSize: 11, color: "#aaa", marginTop: 2 }}>
                      {data.vitamins.taken ? "✅ Sudah diminum hari ini!" : "Belum minum vitamin hari ini"}
                    </div>
                  </div>
                  <button onClick={toggleVitamin} style={{ padding: "8px 16px", borderRadius: 12, border: "none", fontFamily: "'Nunito',sans-serif", fontWeight: 700, fontSize: 12, cursor: "pointer", background: data.vitamins.taken ? "#e8f5e9" : "linear-gradient(135deg,#f06292,#e91e8c)", color: data.vitamins.taken ? "#2e7d32" : "#fff" }}>
                    {data.vitamins.taken ? "✓ Done" : "Tandai"}
                  </button>
                </div>
              </div>
            </div>

            {/* Quick stats */}
            <div style={s.card}>
              <div style={s.cardTitle}>📊 Ringkasan</div>
              <div style={s.row}>
                <div style={s.insightCard("#fce4ec")}><div style={{ fontSize: 20, fontWeight: 900, color: "#c2185b" }}>{data.cycleLength}</div><div style={{ fontSize: 10, color: "#e91e8c", fontWeight: 600 }}>Panjang Siklus</div></div>
                <div style={s.insightCard("#fce4ec")}><div style={{ fontSize: 20, fontWeight: 900, color: "#c2185b" }}>{data.periods.length}</div><div style={{ fontSize: 10, color: "#e91e8c", fontWeight: 600 }}>Total Haid</div></div>
                <div style={s.insightCard("#fce4ec")}><div style={{ fontSize: 20, fontWeight: 900, color: "#c2185b" }}>{daysUntilNext != null ? Math.max(0, daysUntilNext) : "-"}</div><div style={{ fontSize: 10, color: "#e91e8c", fontWeight: 600 }}>Hari Lagi</div></div>
              </div>
            </div>
          </>
        )}

        {/* ===== KALENDER ===== */}
        {tab === "calendar" && (
          <div style={{ ...s.card, padding: "14px 10px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
              <button onClick={() => { if (calMonth === 0) { setCalMonth(11); setCalYear(y => y - 1); } else setCalMonth(m => m - 1); }} style={{ background: "#fce4ec", border: "none", borderRadius: 10, padding: "5px 12px", fontSize: 16, cursor: "pointer" }}>‹</button>
              <div style={{ fontWeight: 800, fontSize: 14, color: "#c2185b" }}>{MONTHS[calMonth]} {calYear}</div>
              <button onClick={() => { if (calMonth === 11) { setCalMonth(0); setCalYear(y => y + 1); } else setCalMonth(m => m + 1); }} style={{ background: "#fce4ec", border: "none", borderRadius: 10, padding: "5px 12px", fontSize: 16, cursor: "pointer" }}>›</button>
            </div>

            {/* Day headers */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 2, marginBottom: 2 }}>
              {["Min","Sen","Sel","Rab","Kam","Jum","Sab"].map(d => (
                <div key={d} style={{ textAlign: "center", fontSize: 9, fontWeight: 700, color: "#f48fb1", padding: "2px 0" }}>{d}</div>
              ))}
            </div>

            {/* Calendar grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 2 }}>
              {Array(firstDay).fill(null).map((_, i) => <div key={`e${i}`} />)}
              {Array(daysInMonth).fill(null).map((_, i) => {
                const day = i + 1;
                const key = toDateKey(calYear, calMonth, day);
                const st = getDayStatus(key);
                const isToday = key === todayKey;
                const hasLog = !!data.logs[key];

                let bg = "transparent";
                let color = "#555";
                let border = "2px solid transparent";
                let dayLabel = String(day);
                let extraEmoji = null;

                if (st === "birthday_ayu") { bg = "linear-gradient(135deg,#ff6b9d,#c44569)"; color = "#fff"; extraEmoji = "🎂"; }
                else if (st === "birthday_bhakti") { bg = "linear-gradient(135deg,#a18cd1,#fbc2eb)"; color = "#fff"; extraEmoji = "🎂"; }
                else if (st === "period") { bg = "linear-gradient(135deg,#f06292,#e91e8c)"; color = "#fff"; }
                else if (st === "predicted") { bg = "linear-gradient(135deg,#f8bbd0,#f48fb1)"; color = "#fff"; }
                else if (st === "ovulation") { bg = "linear-gradient(135deg,#ce93d8,#ab47bc)"; color = "#fff"; }
                else if (st === "fertile") { bg = "linear-gradient(135deg,#c8e6c9,#66bb6a)"; color = "#fff"; }
                else if (isToday) { bg = "#fce4ec"; color = "#e91e8c"; border = "2px solid #f48fb1"; }

                return (
                  <div key={day} style={{ position: "relative" }} onClick={() => { setLogDate(key); setLogModal(true); }}>
                    <div style={{
                      width: "100%",
                      paddingBottom: "100%",
                      position: "relative",
                      borderRadius: "50%",
                      background: bg,
                      border,
                      cursor: "pointer",
                    }}>
                      <div style={{
                        position: "absolute", inset: 0,
                        display: "flex", flexDirection: "column",
                        alignItems: "center", justifyContent: "center",
                        fontSize: extraEmoji ? 8 : 11,
                        fontWeight: isToday ? 800 : 500,
                        color,
                        lineHeight: 1,
                      }}>
                        {extraEmoji ? (
                          <>
                            <span style={{ fontSize: 10 }}>{extraEmoji}</span>
                            <span style={{ fontSize: 8 }}>{day}</span>
                          </>
                        ) : day}
                      </div>
                    </div>
                    {hasLog && <div style={{ position: "absolute", bottom: 0, right: 0, width: 5, height: 5, borderRadius: "50%", background: "#e91e8c" }} />}
                  </div>
                );
              })}
            </div>

            {/* Legend */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 12 }}>
              {[["#e91e8c","Haid"],["#f48fb1","Prediksi"],["#ab47bc","Ovulasi"],["#66bb6a","Subur"],["#c44569","Ultah Ayu"],["#a18cd1","Ultah Mas"]].map(([c, l]) => (
                <div key={l} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 10, color: "#888" }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: c }} />{l}
                </div>
              ))}
            </div>

            <button style={{ ...s.btn("primary"), width: "100%", marginTop: 12 }} onClick={() => togglePeriod(todayKey)}>
              {periodDates.has(todayKey) ? "❌ Hapus Haid Hari Ini" : "🌸 Tandai Haid Hari Ini"}
            </button>

            {predictions.length > 0 && (
              <div style={{ marginTop: 14 }}>
                <div style={s.cardTitle}>Prediksi Berikutnya</div>
                {predictions.map((d, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: "1px solid #fce4ec", fontSize: 13, color: "#888" }}>
                    <span>Siklus {i + 1}</span>
                    <span style={{ fontWeight: 700, color: "#e91e8c" }}>{d.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ===== ANALISA ===== */}
        {tab === "analysis" && (
          <>
            {analysis ? (
              <>
                <div style={s.card}>
                  <div style={s.cardTitle}>📊 Analisa Siklus</div>
                  <div style={s.row}>
                    <div style={s.insightCard("#fce4ec")}><div style={{ fontSize: 20, fontWeight: 900, color: "#c2185b" }}>{analysis.avg}</div><div style={{ fontSize: 10, color: "#e91e8c", fontWeight: 600 }}>Rata-rata Siklus</div></div>
                    <div style={s.insightCard("#fce4ec")}><div style={{ fontSize: 20, fontWeight: 900, color: "#c2185b" }}>{analysis.last}</div><div style={{ fontSize: 10, color: "#e91e8c", fontWeight: 600 }}>Siklus Terakhir</div></div>
                    <div style={s.insightCard("#fce4ec")}><div style={{ fontSize: 20, fontWeight: 900, color: "#c2185b" }}>{analysis.total}</div><div style={{ fontSize: 10, color: "#e91e8c", fontWeight: 600 }}>Total Data</div></div>
                  </div>
                  <div style={{ marginTop: 14, padding: "12px", background: analysis.status === "normal" ? "#e8f5e9" : analysis.status.includes("late") ? "#fff3e0" : "#fce4ec", borderRadius: 14 }}>
                    <div style={{ fontWeight: 800, color: "#c2185b", fontSize: 14, marginBottom: 6 }}>
                      {analysis.status === "normal" && "✅ "}{analysis.status === "late" && "⚠️ "}{analysis.status === "very_late" && "🔴 "}{analysis.status === "early" && "💙 "}{analysis.status === "very_early" && "💙 "}
                      {analysis.conclusion}
                    </div>
                    <div style={{ fontSize: 12, color: "#888" }}>{analysis.suggestion}</div>
                  </div>
                </div>
                <div style={s.card}>
                  <div style={s.cardTitle}>📅 Riwayat Haid</div>
                  {[...data.periods].sort((a, b) => new Date(b) - new Date(a)).slice(0, 6).map((p, i, arr) => {
                    const prev = arr[i + 1];
                    const gap = prev ? Math.round((new Date(p) - new Date(prev)) / 86400000) : null;
                    return (
                      <div key={p} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid #fce4ec" }}>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 700, color: "#c2185b" }}>{new Date(p + "T00:00:00").toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</div>
                          {gap && <div style={{ fontSize: 11, color: "#aaa" }}>Jarak: {gap} hari</div>}
                        </div>
                        {gap && <div style={s.statusBadge(Math.abs(gap - data.cycleLength) <= 3 ? "#66bb6a" : Math.abs(gap - data.cycleLength) <= 7 ? "#ffa726" : "#ef5350")}>
                          {Math.abs(gap - data.cycleLength) <= 3 ? "Normal" : gap > data.cycleLength ? `+${gap - data.cycleLength}` : `${gap - data.cycleLength}`}
                        </div>}
                      </div>
                    );
                  })}
                </div>
                {Object.keys(data.logs).length > 0 && (
                  <div style={s.card}>
                    <div style={s.cardTitle}>💕 Laporan Mood Bulan Ini</div>
                    {(() => {
                      const thisMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;
                      const monthLogs = Object.entries(data.logs).filter(([k]) => k.startsWith(thisMonth));
                      const moodCount = {};
                      monthLogs.forEach(([, l]) => { if (l.mood) moodCount[l.mood] = (moodCount[l.mood] || 0) + 1; });
                      const topMoods = Object.entries(moodCount).sort((a, b) => b[1] - a[1]).slice(0, 3);
                      return topMoods.length ? topMoods.map(([id, count]) => {
                        const m = MOODS.find(x => x.id === id);
                        return <div key={id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "7px 0", borderBottom: "1px solid #fce4ec", fontSize: 13 }}>
                          <span>{m?.emoji} {m?.label}</span>
                          <span style={{ fontWeight: 700, color: "#e91e8c" }}>{count}x</span>
                        </div>;
                      }) : <div style={{ fontSize: 13, color: "#aaa", textAlign: "center" }}>Belum ada data mood bulan ini 🌸</div>;
                    })()}
                  </div>
                )}
              </>
            ) : (
              <div style={{ ...s.card, textAlign: "center", padding: "40px 20px" }}>
                <div style={{ fontSize: 48 }}>📊</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#c2185b", marginTop: 12 }}>Belum ada data cukup</div>
                <div style={{ fontSize: 13, color: "#aaa", marginTop: 8 }}>Tandai minimal 2 siklus haid untuk melihat analisa lengkap ya Ayu 🌸</div>
              </div>
            )}
          </>
        )}

        {/* ===== PESAN (dari pacar) ===== */}
        {tab === "pesan" && (
          <>
            {/* Today's auto message preview */}
            <div style={{ ...s.card, background: "linear-gradient(135deg,#fce4ec,#fff0f5)", border: "1.5px solid #f8bbd0" }}>
              <div style={s.cardTitle}>💌 Pesan Hari Ini dari Mas Bhakti</div>
              <div style={{ fontSize: 14, color: "#c2185b", fontWeight: 600, lineHeight: 1.6, fontStyle: "italic" }}>
                "{dailyLoveMsg}"
              </div>
              <div style={{ fontSize: 11, color: "#f48fb1", marginTop: 8, textAlign: "right" }}>— Mas Bhakti 💕</div>
              <div style={{ marginTop: 10, padding: "8px 12px", background: "rgba(255,255,255,.6)", borderRadius: 10, fontSize: 11, color: "#aaa", textAlign: "center" }}>
                ✨ Pesan berubah otomatis setiap hari — 365 pesan penuh cinta
              </div>
            </div>

            {/* Custom messages */}
            <div style={{ ...s.card, background: "linear-gradient(135deg,#fce4ec,#fff0f5)" }}>
              <div style={s.cardTitle}>💝 Tambah Pesan Khusus</div>
              <div style={{ fontSize: 12, color: "#888", marginBottom: 12 }}>Pesan ini akan muncul otomatis sesuai fase siklus Ayu 🌸</div>
              <div style={s.sLabel}>Tulis Pesan</div>
              <textarea value={newMsg.text} onChange={e => setNewMsg(m => ({ ...m, text: e.target.value }))}
                placeholder="Tulis pesan penyemangat untuk Ayu 💕"
                style={{ width: "100%", padding: "10px 12px", borderRadius: 12, border: "1.5px solid #fce4ec", fontFamily: "'Nunito',sans-serif", fontSize: 13, resize: "none", height: 70, outline: "none", boxSizing: "border-box" }} />
              <div style={s.sLabel}>Tampilkan Saat</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {[{ phase: "period", label: "Saat haid" },{ phase: "pms", label: "Saat PMS" },{ phase: "ovulation", label: "Masa subur" },{ phase: "any", label: "Setiap hari" }].map(t => (
                  <button key={t.phase} style={s.chip(newMsg.phase === t.phase)} onClick={() => setNewMsg(m => ({ ...m, phase: t.phase }))}>{t.label}</button>
                ))}
              </div>
              <div style={s.sLabel}>Emoji</div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {["💕","🌸","🥰","💖","✨","🌹","🫂","💝"].map(e => (
                  <button key={e} onClick={() => setNewMsg(m => ({ ...m, emoji: e }))}
                    style={{ fontSize: 20, background: newMsg.emoji === e ? "#fce4ec" : "transparent", border: `2px solid ${newMsg.emoji === e ? "#e91e8c" : "transparent"}`, borderRadius: 10, padding: 4, cursor: "pointer" }}>{e}</button>
                ))}
              </div>
              <button style={{ ...s.btn("primary"), width: "100%", marginTop: 14 }} onClick={addBfMessage}>💾 Simpan Pesan</button>
            </div>

            {(data.boyfriendMessages || []).length > 0 && (
              <div style={s.card}>
                <div style={s.cardTitle}>Pesan Tersimpan</div>
                {(data.boyfriendMessages || []).map(m => (
                  <div key={m.id} style={{ padding: "10px 0", borderBottom: "1px solid #fce4ec", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <div style={{ fontSize: 13, color: "#c2185b", fontWeight: 600 }}>{m.emoji} {m.text}</div>
                      <div style={{ fontSize: 11, color: "#aaa", marginTop: 3 }}>
                        {[{ phase: "period", label: "Saat haid" },{ phase: "pms", label: "Saat PMS" },{ phase: "ovulation", label: "Masa subur" },{ phase: "any", label: "Setiap hari" }].find(t => t.phase === m.phase)?.label}
                      </div>
                    </div>
                    <button onClick={() => deleteBfMsg(m.id)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 16, color: "#f48fb1" }}>🗑️</button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* ===== CATATAN ===== */}
        {tab === "log" && (
          <div style={s.card}>
            <div style={s.cardTitle}>Riwayat Catatan</div>
            {Object.keys(data.logs).length === 0 ? (
              <div style={{ textAlign: "center", color: "#f48fb1", padding: "30px 0" }}>
                <div style={{ fontSize: 40 }}>🌸</div>
                <div style={{ marginTop: 8, fontSize: 13 }}>Belum ada catatan. Mulai dari beranda ya!</div>
              </div>
            ) : Object.entries(data.logs).sort((a, b) => new Date(b[0]) - new Date(a[0])).map(([date, log]) => (
              <div key={date} onClick={() => { setLogDate(date); setLogModal(true); }} style={{ padding: "10px 0", borderBottom: "1px solid #fce4ec", cursor: "pointer" }}>
                <div style={{ fontWeight: 700, color: "#c2185b", fontSize: 13 }}>{new Date(date + "T00:00:00").toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long" })}</div>
                <div style={{ display: "flex", gap: 5, marginTop: 4, flexWrap: "wrap" }}>
                  {log.mood && <span style={{ background: "#fce4ec", borderRadius: 8, padding: "2px 7px", fontSize: 11, color: "#e91e8c" }}>{MOODS.find(m => m.id === log.mood)?.emoji} {MOODS.find(m => m.id === log.mood)?.label}</span>}
                  {log.symptoms?.map(sym => <span key={sym} style={{ background: "#fce4ec", borderRadius: 8, padding: "2px 7px", fontSize: 11, color: "#e91e8c" }}>{SYMPTOMS.find(x => x.id === sym)?.emoji}</span>)}
                </div>
                {log.note && <div style={{ fontSize: 11, color: "#aaa", marginTop: 4, fontStyle: "italic" }}>"{log.note}"</div>}
              </div>
            ))}
          </div>
        )}

        {/* BOTTOM NAV */}
        <nav style={s.nav}>
          {[
            { id: "home", emoji: "🏠", label: "Beranda" },
            { id: "calendar", emoji: "📅", label: "Kalender" },
            { id: "analysis", emoji: "📊", label: "Analisa" },
            { id: "pesan", emoji: "💌", label: "Pesan" },
            { id: "log", emoji: "📝", label: "Catatan" },
          ].map(t => (
            <button key={t.id} style={s.navBtn(tab === t.id)} onClick={() => setTab(t.id)}>
              <span style={{ fontSize: 20 }}>{t.emoji}</span>
              {t.label}
            </button>
          ))}
        </nav>

        {/* LOG MODAL */}
        {logModal && logDate && (
          <div style={s.modal} onClick={() => setLogModal(false)}>
            <div style={s.modalBox} onClick={e => e.stopPropagation()}>
              <div style={{ fontSize: 17, fontWeight: 800, color: "#c2185b", marginBottom: 2 }}>Catatan 📝</div>
              <div style={{ fontSize: 12, color: "#f48fb1", marginBottom: 16 }}>{new Date(logDate + "T00:00:00").toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</div>
              <div style={s.sLabel}>🌸 Tandai Haid</div>
              <button style={{ ...s.btn(data.periods.includes(logDate) ? "danger" : "primary"), width: "100%" }} onClick={() => togglePeriod(logDate)}>
                {data.periods.includes(logDate) ? "❌ Hapus Tanda Haid" : "🌸 Ini Hari Pertama Haid"}
              </button>
              {(data.periods.includes(logDate) || periodDates.has(logDate)) && <>
                <div style={s.sLabel}>💧 Aliran Darah</div>
                <div style={{ display: "flex", gap: 8 }}>
                  {FLOW.map(f => <button key={f.id} style={s.chip(currentLog.flow === f.id)} onClick={() => updateLog("flow", currentLog.flow === f.id ? null : f.id)}>{"●".repeat(f.dots)} {f.label}</button>)}
                </div>
              </>}
              <div style={s.sLabel}>💕 Mood</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {MOODS.map(m => <button key={m.id} style={s.chip(currentLog.mood === m.id)} onClick={() => updateLog("mood", currentLog.mood === m.id ? null : m.id)}>{m.emoji} {m.label}</button>)}
              </div>
              <div style={s.sLabel}>🌿 Gejala</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {SYMPTOMS.map(sym => <button key={sym.id} style={s.chip((currentLog.symptoms || []).includes(sym.id))} onClick={() => toggleArrayLog("symptoms", sym.id)}>{sym.emoji} {sym.label}</button>)}
              </div>
              <div style={s.sLabel}>✍️ Catatan</div>
              <textarea value={currentLog.note || ""} onChange={e => updateLog("note", e.target.value)}
                placeholder="Mau tulis apa hari ini, Ayu? 💕"
                style={{ width: "100%", padding: "10px 12px", borderRadius: 12, border: "1.5px solid #fce4ec", fontFamily: "'Nunito',sans-serif", fontSize: 13, resize: "none", height: 70, outline: "none", boxSizing: "border-box" }} />
              <button style={{ ...s.btn("primary"), width: "100%", marginTop: 14 }} onClick={() => { setLogModal(false); showNotif("Catatan disimpan! 💕"); }}>Simpan 💾</button>
            </div>
          </div>
        )}

        {/* SETTINGS */}
        {settingsOpen && (
          <div style={s.modal} onClick={() => setSettingsOpen(false)}>
            <div style={s.modalBox} onClick={e => e.stopPropagation()}>
              <div style={{ fontSize: 17, fontWeight: 800, color: "#c2185b", marginBottom: 4 }}>⚙️ Pengaturan</div>
              <div style={s.sLabel}>📅 Panjang Siklus (hari)</div>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <button onClick={() => setData(d => ({ ...d, cycleLength: Math.max(21, d.cycleLength - 1) }))} style={{ ...s.btn("ghost"), padding: "8px 16px" }}>−</button>
                <span style={{ fontSize: 24, fontWeight: 900, color: "#e91e8c", flex: 1, textAlign: "center" }}>{data.cycleLength}</span>
                <button onClick={() => setData(d => ({ ...d, cycleLength: Math.min(40, d.cycleLength + 1) }))} style={{ ...s.btn("ghost"), padding: "8px 16px" }}>+</button>
              </div>
              <div style={s.sLabel}>🗑️ Hapus Semua Data</div>
              <button style={{ ...s.btn("danger"), width: "100%" }} onClick={() => { if (confirm("Yakin mau hapus semua data? 🥺")) { setData({ periods: [], logs: {}, cycleLength: 28, boyfriendMessages: [], partnerName: "Mas Bhakti", waterToday: { date: "", count: 0 }, vitamins: { date: "", taken: false } }); setSettingsOpen(false); showNotif("Data dihapus 🌿"); } }}>Hapus Semua Data</button>
              <button style={{ ...s.btn("ghost"), width: "100%", marginTop: 10 }} onClick={() => setSettingsOpen(false)}>Tutup</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}