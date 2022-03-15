importClass(java.io.StringWriter);
importClass(java.io.StringReader);
importClass(java.io.PrintWriter);
importClass(java.io.BufferedReader);
importClass(java.lang.StringBuilder);

module.exports = function PrintExceptionStack(except) {
	if (except) {
		console.error(
			util.format(
				"fileName: %s line:%s typeof e:%s",
				except.fileName,
				except.lineNumber,
				typeof except
			)
		);
		let throwable = null;
		if (except.javaException) {
			throwable = except.javaException;
		} else if (except.rhinoException) {
			throwable = except.rhinoException;
		}
		if (throwable) {
			let scriptTrace = new StringBuilder(
				except.message == null ? "" : except.message + "\n"
			);
			let stringWriter = new StringWriter();
			let writer = new PrintWriter(stringWriter);
			throwable.printStackTrace(writer);
			writer.close();
			let bufferedReader = new BufferedReader(
				new StringReader(stringWriter.toString())
			);
			let line;
			while ((line = bufferedReader.readLine()) != null) {
				scriptTrace.append("\n").append(line);
			}
			console.error(scriptTrace.toString());
		} else {
			let funcs = Object.getOwnPropertyNames(except);
			for (let idx in funcs) {
				let func_name = funcs[idx];
				console.verbose(func_name);
			}
		}
	}
};
