package servlet;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.google.gson.Gson;

@WebServlet("/AngularJsServlet")
public class AngularJsServlet extends HttpServlet{ 

	private static final long serialVersionUID = 1L;

	public AngularJsServlet() {
		super();
	}

	public void doGet(HttpServletRequest req, HttpServletResponse response) throws ServletException, IOException { 

		response.setContentType("application/json");
		try (PrintWriter out = response.getWriter()) {
			Mydb db = new Mydb();
			Connection con = db.getCon();
			ArrayList<Widget> al = new ArrayList<>();

			try {
				Statement   stmt = con.createStatement();
				ResultSet rs = stmt.executeQuery("select * from widgets2 order by idWidget ASC");
				while (rs.next()) {
					Widget userobj;
					userobj = new Widget(rs.getString("dataJson"), rs.getInt("idWidget"));
					al.add(userobj);
				}
				JSONArray arrayObj = new JSONArray(al);
				String json = new Gson().toJson(arrayObj);
				response.getWriter().write(json);
			} catch (SQLException ex) {
				Logger.getLogger(AngularJsServlet.class.getName()).log(Level.SEVERE, null, ex);
			}
		}
	} 

	public void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

		StringBuilder sb = new StringBuilder();
		BufferedReader br = request.getReader();
		String str;
		while( (str = br.readLine()) != null ){
			sb.append(str);
		}    
		try {
			JSONObject jObj = new JSONObject(sb.toString());
			int idWidget = jObj.getInt("idWidget");

			Mydb db = new Mydb();
			Connection con = db.getCon();
			Statement st = con.createStatement();

			String sql = "insert into widgets2 (idWidget, dataJson) values('"
					+ idWidget + "', '"
					+ jObj
					+ "')";

			@SuppressWarnings("unused")
			int flag = st.executeUpdate(sql);

		} catch (JSONException e) {
			e.printStackTrace();
		} catch (SQLException ex) {
			Logger.getLogger(AngularJsServlet.class.getName()).log(Level.SEVERE, null, ex);
		}
	}
	
	public void doPut(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		
		StringBuilder sb = new StringBuilder();
		BufferedReader br = request.getReader();
		String str;
		while( (str = br.readLine()) != null ){
			sb.append(str);
		}    
		try {
			JSONObject jObj = new JSONObject(sb.toString());
			int idWidget = jObj.getInt("idWidget");

			Mydb db = new Mydb();
			Connection con = db.getCon();
			Statement st = con.createStatement();

			String sql = "update widgets2 set dataJson = '"
					+ jObj
					+ "' where idWidget = " + idWidget;

			@SuppressWarnings("unused")
			int flag = st.executeUpdate(sql);

		} catch (JSONException e) {
			e.printStackTrace();
		} catch (SQLException ex) {
			Logger.getLogger(AngularJsServlet.class.getName()).log(Level.SEVERE, null, ex);
		}
	}
	
	public void doDelete(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		
		StringBuilder sb = new StringBuilder();
		BufferedReader br = request.getReader();
		String str;
		while( (str = br.readLine()) != null ){
			sb.append(str);
		}
		try {
			JSONObject jObj = new JSONObject(sb.toString());
			int idWidget = jObj.getInt("idWidget");

			Mydb db = new Mydb();
			Connection con = db.getCon();
			Statement st = con.createStatement();

			String sql = "delete from widgets2 where idWidget = "
					+ idWidget
					+ " limit 1";

			@SuppressWarnings("unused")
			int flag = st.executeUpdate(sql);
			
			String sql2 = "update widgets2 SET idWidget = idWidget - 1 WHERE idWidget > "
					+ idWidget;

			@SuppressWarnings("unused")
			int flag2 = st.executeUpdate(sql2);
		} catch (JSONException e) {
			e.printStackTrace();
		} catch (SQLException ex) {
			Logger.getLogger(AngularJsServlet.class.getName()).log(Level.SEVERE, null, ex);
		}
	}
}
