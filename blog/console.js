
async function textWrite(ele) {
	var text = ele.textContent;
	var textbuffer = "";
	while(textbuffer.length < text.length)
	{
		textbuffer += text[textbuffer.length];
		ele.textContent = textbuffer;
		await new Promise(r => setTimeout(r, 20));
	}
}

$( document ).ready(function() {
    $(".entrytext").each(function(i, obj) {
		textWrite(obj);
	});
});