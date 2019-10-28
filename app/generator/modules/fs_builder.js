const shell = require('shelljs')
const path = require('path')
const fs = require('fs')
const archiver = require('archiver')

const FsEngine = {
	uid: '',
	publicPath: path.resolve('./public'),
	srcPath: '',
	packageName: 'joomlafonts',
	commonFolder: ['fonts'],
	singleSvgInit: uid => {
		module.exports.uid = uid
		module.exports.createDownloadFolder()
		return module.exports
	},
	init: (uid, force = false) => {
		module.exports.uid = uid
		if (force === true) {
			module.exports.clearTrashCan()
			module.exports.createDownloadFolder()
			module.exports.createIconFontFolders()
			return module.exports
		}
	},
	createDownloadFolder: () => {
		module.exports.userFolder = path.join(module.exports.publicPath)
		shell.mkdir('-p', module.exports.userFolder)
	},
	createIconFontFolders: () => {
		
		module.exports.fontsFolder = path.join(
			module.exports.userFolder,
			module.exports.packageName,
			'fonts'
		)
		
		module.exports.cssFolder = path.join(module.exports.userFolder, module.exports.packageName)
		module.exports.exampleFolder = path.join(module.exports.userFolder, module.exports.packageName)

		shell.mkdir('-p', [
			module.exports.userFolder,
			module.exports.fontsFolder
		])
	},

	/**
	 *
	 * Zip downloadable folders (css, fonts, js, scss )
	 * Make a new folder with zip extension (iconfont.zip)
	 * **/

	zipDir: () => {
		const baseDir = module.exports.userFolder + '/'+ module.exports.packageName +'/'
		const archive = archiver.create('zip', {})
		const output = fs.createWriteStream(module.exports.userFolder + '/'+ module.exports.packageName +'.zip')
		archive.pipe(output)
		archive.directory(baseDir, module.exports.packageName)
		archive.finalize()
		module.exports.userZipFolder = module.exports.userFolder + '/'+ module.exports.packageName +'.zip'
	},

	clearTrashCan: () => {
		const publicPath = path.join(module.exports.publicPath)
		if (fs.existsSync(publicPath)) shell.rm('-rf', publicPath)
	},

	/*
	 * Move new generated iconfont folder to the assets folder 
	 * Make a zip file and move it to the package download folder
	 */

	moveFilesToDestination: () => {
		const assets = path.join(module.exports.publicPath, module.exports.packageName)
		const downloadPath = path.join(module.exports.publicPath, 'download', 'global_package')
		if (fs.existsSync(assets)) shell.rm('-rf', assets)
		if (fs.existsSync(downloadPath + '/'+ module.exports.packageName +'.zip'))
			shell.rm('-rf', downloadPath + '/'+ module.exports.packageName +'.zip')

		const baseDir = module.exports.userFolder + '/'+ module.exports.packageName +'/'
		shell.mv(baseDir, assets)
		shell.mv(module.exports.userFolder + '/'+ module.exports.packageName +'.zip', downloadPath)
		shell.rm('-rf', module.exports.userFolder)
	}
}

module.exports = FsEngine
