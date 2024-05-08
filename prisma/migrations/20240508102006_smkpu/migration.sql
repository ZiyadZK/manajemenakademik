-- CreateTable
CREATE TABLE `data_profil_sekolah` (
    `npsn` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `bentuk_pendidikan` VARCHAR(191) NOT NULL,
    `status_kepemilikan` VARCHAR(191) NOT NULL,
    `sk_pendirian_sekolah` VARCHAR(191) NOT NULL,
    `tanggal_sk_pendirian` VARCHAR(191) NOT NULL,
    `sk_izin_operasional` VARCHAR(191) NOT NULL,
    `tanggal_sk_izin_operasional` VARCHAR(191) NOT NULL,
    `operator` VARCHAR(191) NOT NULL,
    `akreditasi` VARCHAR(191) NOT NULL,
    `kurikulum` VARCHAR(191) NOT NULL,
    `waktu` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`npsn`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `data_mutasi_siswa` (
    `kelas` VARCHAR(200) NULL,
    `rombel` VARCHAR(200) NULL,
    `no_rombel` VARCHAR(200) NULL,
    `nama_siswa` VARCHAR(200) NULL,
    `nis` VARCHAR(191) NOT NULL,
    `nisn` VARCHAR(200) NULL,
    `nik` VARCHAR(200) NULL,
    `no_kk` VARCHAR(200) NULL,
    `tempat_lahir` VARCHAR(200) NULL,
    `tanggal_lahir` VARCHAR(200) NULL,
    `jenis_kelamin` VARCHAR(200) NULL,
    `agama` VARCHAR(200) NULL,
    `status_dalam_keluarga` VARCHAR(200) NULL,
    `anak_ke` VARCHAR(200) NULL,
    `alamat` VARCHAR(200) NULL,
    `no_hp_siswa` VARCHAR(200) NULL,
    `asal_sekolah` VARCHAR(200) NULL,
    `kategori` VARCHAR(200) NULL,
    `tahun_masuk` VARCHAR(191) NOT NULL,
    `tahun_keluar` VARCHAR(191) NOT NULL,
    `tanggal_keluar` VARCHAR(191) NOT NULL,
    `nama_ayah` VARCHAR(200) NULL,
    `nama_ibu` VARCHAR(200) NULL,
    `telp_ortu` VARCHAR(200) NULL,
    `pekerjaan_ayah` VARCHAR(200) NULL,
    `pekerjaan_ibu` VARCHAR(200) NULL,

    UNIQUE INDEX `nisn`(`nisn`),
    PRIMARY KEY (`nis`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `data_akuns` (
    `id_akun` VARCHAR(255) NOT NULL,
    `email_akun` VARCHAR(255) NULL,
    `password_akun` VARCHAR(255) NULL,
    `nama_akun` VARCHAR(255) NULL,
    `role_akun` VARCHAR(255) NULL,

    UNIQUE INDEX `email_akun`(`email_akun`),
    PRIMARY KEY (`id_akun`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `data_ijazahs` (
    `no` INTEGER NOT NULL AUTO_INCREMENT,
    `tgl_diambil` VARCHAR(191) NOT NULL,
    `nama_lulusan` VARCHAR(200) NULL,
    `nisn` VARCHAR(200) NULL,
    `nama_pengambil` VARCHAR(200) NULL,
    `kelas` VARCHAR(200) NULL,
    `rombel` VARCHAR(191) NOT NULL,
    `no_rombel` VARCHAR(191) NOT NULL,
    `tahun_lulus` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`no`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `data_sertifikat` (
    `sertifikat_id` VARCHAR(191) NOT NULL,
    `sertifikat_id_pegawai` INTEGER NOT NULL,
    `jenis_sertifikat` VARCHAR(191) NOT NULL,
    `nama_sertifikat` VARCHAR(191) NOT NULL,
    `fileUrl` VARCHAR(191) NOT NULL,
    `keterangan` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`sertifikat_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `data_pegawai` (
    `id_pegawai` INTEGER NOT NULL AUTO_INCREMENT,
    `nama_pegawai` VARCHAR(255) NULL,
    `jabatan` VARCHAR(255) NULL,
    `status_kepegawaian` VARCHAR(255) NULL,
    `nik` VARCHAR(16) NULL,
    `nip` VARCHAR(255) NULL,
    `nuptk` VARCHAR(255) NULL,
    `tmpt_lahir` VARCHAR(255) NULL,
    `tgl_lahir` VARCHAR(255) NULL,
    `tmt` VARCHAR(255) NULL,
    `pendidikan_terakhir` VARCHAR(255) NULL,
    `sekolah_pendidikan` VARCHAR(255) NULL,
    `sarjana_universitas` VARCHAR(255) NULL,
    `sarjana_fakultas` VARCHAR(255) NULL,
    `sarjana_prodi` VARCHAR(255) NULL,
    `magister_universitas` VARCHAR(255) NULL,
    `magister_fakultas` VARCHAR(255) NULL,
    `magister_prodi` VARCHAR(255) NULL,
    `keterangan` VARCHAR(255) NULL,
    `pensiun` BOOLEAN NULL,

    UNIQUE INDEX `data_pegawai_nik_key`(`nik`),
    PRIMARY KEY (`id_pegawai`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `data_siswa` (
    `kelas` VARCHAR(200) NULL,
    `rombel` VARCHAR(200) NULL,
    `no_rombel` VARCHAR(200) NULL,
    `nama_siswa` VARCHAR(200) NULL,
    `nis` VARCHAR(191) NOT NULL,
    `nisn` VARCHAR(200) NULL,
    `nik` VARCHAR(200) NULL,
    `no_kk` VARCHAR(200) NULL,
    `tempat_lahir` VARCHAR(200) NULL,
    `tanggal_lahir` VARCHAR(200) NULL,
    `jenis_kelamin` VARCHAR(200) NULL,
    `agama` VARCHAR(200) NULL,
    `status_dalam_keluarga` VARCHAR(200) NULL,
    `anak_ke` VARCHAR(200) NULL,
    `alamat` VARCHAR(200) NULL,
    `no_hp_siswa` VARCHAR(200) NULL,
    `asal_sekolah` VARCHAR(200) NULL,
    `kategori` VARCHAR(200) NULL,
    `tahun_masuk` VARCHAR(191) NOT NULL,
    `nama_ayah` VARCHAR(200) NULL,
    `nama_ibu` VARCHAR(200) NULL,
    `telp_ortu` VARCHAR(200) NULL,
    `pekerjaan_ayah` VARCHAR(200) NULL,
    `pekerjaan_ibu` VARCHAR(200) NULL,
    `aktif` VARCHAR(200) NULL,

    UNIQUE INDEX `nisn`(`nisn`),
    PRIMARY KEY (`nis`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `data_alumni` (
    `kelas` VARCHAR(200) NULL,
    `rombel` VARCHAR(200) NULL,
    `no_rombel` VARCHAR(200) NULL,
    `nama_siswa` VARCHAR(200) NULL,
    `nis` VARCHAR(191) NOT NULL,
    `nisn` VARCHAR(200) NULL,
    `nik` VARCHAR(200) NULL,
    `no_kk` VARCHAR(200) NULL,
    `tempat_lahir` VARCHAR(200) NULL,
    `tanggal_lahir` VARCHAR(200) NULL,
    `jenis_kelamin` VARCHAR(200) NULL,
    `agama` VARCHAR(200) NULL,
    `status_dalam_keluarga` VARCHAR(200) NULL,
    `anak_ke` VARCHAR(200) NULL,
    `alamat` VARCHAR(200) NULL,
    `no_hp_siswa` VARCHAR(200) NULL,
    `asal_sekolah` VARCHAR(200) NULL,
    `kategori` VARCHAR(200) NULL,
    `tahun_masuk` VARCHAR(191) NOT NULL,
    `tahun_keluar` VARCHAR(191) NOT NULL,
    `tanggal_keluar` VARCHAR(191) NOT NULL,
    `nama_ayah` VARCHAR(200) NULL,
    `nama_ibu` VARCHAR(200) NULL,
    `telp_ortu` VARCHAR(200) NULL,
    `pekerjaan_ayah` VARCHAR(200) NULL,
    `pekerjaan_ibu` VARCHAR(200) NULL,

    UNIQUE INDEX `nisn`(`nisn`),
    PRIMARY KEY (`nis`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `data_kelas` (
    `id_kelas` VARCHAR(191) NOT NULL,
    `kelas` VARCHAR(191) NOT NULL,
    `id_walikelas` VARCHAR(191) NOT NULL,
    `nama_walikelas` VARCHAR(191) NOT NULL,
    `nik_walikelas` VARCHAR(191) NOT NULL,
    `id_guru_bk` VARCHAR(191) NOT NULL,
    `nama_guru_bk` VARCHAR(191) NOT NULL,
    `nik_guru_bk` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id_kelas`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `data_riwayat_perubahan` (
    `no` INTEGER NOT NULL AUTO_INCREMENT,
    `waktu` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `status` VARCHAR(191) NOT NULL,
    `data` VARCHAR(191) NOT NULL,
    `detail` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`no`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
