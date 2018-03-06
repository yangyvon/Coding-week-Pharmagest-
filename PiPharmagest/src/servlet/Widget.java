package servlet;

public class Widget {

	private int idWidget;
	private String jsonData;
	
	public Widget(String jsonData, int id) {
		
		this.jsonData = jsonData;
		this.idWidget = id;
	}

	public int getIdWidget() {
		return idWidget;
	}

	public void setIdWidget(int idWidget) {
		this.idWidget = idWidget;
	}

	public String getJsonData() {
		return jsonData;
	}

	public void setJsonData(String jsonData) {
		this.jsonData = jsonData;
	}
}
