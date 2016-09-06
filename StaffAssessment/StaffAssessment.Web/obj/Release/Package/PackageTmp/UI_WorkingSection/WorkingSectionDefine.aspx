<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="WorkingSectionDefine.aspx.cs" Inherits="StaffAssessment.Web.UI_WorkingSection.WorkingSectionDefine" %>

<%@ Register Src="/UI_WebUserControls/OrganizationSelector/OrganisationTree.ascx" TagName="OrganisationTree" TagPrefix="uc1" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>岗位定义</title>
    <link rel="stylesheet" type="text/css" href="/lib/ealib/themes/gray/easyui.css"/>
	<link rel="stylesheet" type="text/css" href="/lib/ealib/themes/icon.css"/>
    <link rel="stylesheet" type="text/css" href="/lib/extlib/themes/syExtIcon.css"/>
    <link rel="stylesheet" type="text/css" href="/lib/extlib/themes/syExtCss.css"/>

	<script type="text/javascript" src="/lib/ealib/jquery.min.js" charset="utf-8"></script>
	<script type="text/javascript" src="/lib/ealib/jquery.easyui.min.js" charset="utf-8"></script>
    <script type="text/javascript" src="/lib/ealib/easyui-lang-zh_CN.js" charset="utf-8"></script>

    <script type="text/javascript" src="/lib/ealib/extend/jquery.PrintArea.js" charset="utf-8"></script> 
    <script type="text/javascript" src="/lib/ealib/extend/jquery.jqprint.js" charset="utf-8"></script>
    <!--[if lt IE 8 ]><script type="text/javascript" src="/js/common/json2.min.js"></script><![endif]-->
    <script type="text/javascript" src="/js/common/PrintFile.js" charset="utf-8"></script> 

    <script type="text/javascript" src="js/page/WorkingSectionDefine.js" charset="utf-8"></script>
</head>
<body>
    <div id="cc" class="easyui-layout"data-options="fit:true,border:false" >    
         <div data-options="region:'west',split:true" style="width: 230px;">
            <uc1:OrganisationTree ID="OrganisationTree_ProductionLine" runat="server" />
        </div>
          <div id="toorBar" title="" style="height:28px;padding:10px;">
            <div>
                <table>
                    <tr>
                         <td>产线:</td>
                        <td >                               
                            <input id="organizationName" class="easyui-textbox" readonly="readonly"style="width:120px" />               
                       </td>                    
                           <td>
                            <a id="btn" href="#" class="easyui-linkbutton" data-options="iconCls:'icon-search'" onclick="Query()">查询</a>
                        </td>
<%--                    </tr>
                </table>  
                <table>

                    <tr>--%>
                        <td style="width:40px"></td>
                       <td>
                            <a href="javascript:void(0)" class="easyui-linkbutton" data-options="iconCls:'icon-add',plain:true" onclick="addFun()">添加</a>
                        </td>
                         <td>
                            <a href="javascript:void(0)" class="easyui-linkbutton" data-options="iconCls:'icon-reload',plain:true" onclick="refresh()">刷新</a>
                        </td>
                    </tr>
                </table>         
            </div>
	    </div> 
         <div data-options="region:'center'" style="padding:5px;background:#eee;">
             <table id="grid_Main"class="easyui-datagrid"></table>
         </div>

           <!-- 编辑窗口开始 -->
            <div id="AddandEditor" class="easyui-window" title="添加岗位" data-options="modal:true,closed:true,iconCls:'icon-edit',minimizable:false,maximizable:false,collapsible:false,resizable:false" style="width:420px;height:auto;padding:10px 60px 20px 60px">
	    	    <table>
                     <tr>
	    			    <td>所在产线：</td>
	    			    <td>
                          <input class="easyui-combotree" id="productionName"  style="width:160px" data-options="panelHeight: 'auto'"/>           
	    			    </td>
	    		    </tr>
                    <tr>
	    			<td>岗位类型：</td>
	    			<td>  <input id="sectionType" class="easyui-combobox" style="width:120px">
	    			</td>
	    		    </tr>
                    <tr>
	    			    <td>岗位名称：</td> 
	    			    <td><input class="easyui-textbox" type="text" id="workingSection" style="width:120px" />(*必填)</td>
	    		    </tr>
	    		    <tr>
	    			<td>启用标志：</td>
	    			<td>  
                        <select class="easyui-combobox" id="Enabed" name="delay" style="width:60px" data-options="panelHeight: 'auto'">
                            <option value="True">是</option>
                            <option value="False">否</option>              
                        </select></td>
	    		    </tr>
                     <tr>
	    			    <td>编辑人：</td> 
	    			    <td><input class="easyui-textbox" type="text" id="editor" style="width:120px" /></td>
	    		    </tr>       
                     <tr>
	    			    <td>备注：</td> 
	    			    <td>
                          <input id="remark" class="easyui-textbox" data-options="multiline:true" style="width:160px;height:50px">
	    			    </td>
	    		    </tr>
	    	    </table>
	            <div style="text-align:center;padding:5px;margin-left:-18px;">
	    	        <a href="javascript:void(0)" class="easyui-linkbutton" data-options="iconCls:'icon-ok'" onclick="save()">保存</a>
	    	        <a href="javascript:void(0)" class="easyui-linkbutton" data-options="iconCls:'icon-cancel'" onclick="$('#staffInfoEditor').window('close');">取消</a>
	            </div>
            </div>
            <!-- 编辑窗口开始 -->
             <!-- 编辑窗口开始 -->
            <div id="stafftable" class="easyui-window" title="短信接收" data-options="modal:true,closed:true,iconCls:'icon-edit',minimizable:false,maximizable:false,collapsible:false,resizable:false" style="width:420px;height:400px;padding:2px 10px 2px 10px">
	    	    <table id="grid_staffinfo"></table>   
            </div> 
            <!-- 编辑窗口开始 -->
    </div>
 	  
</body>
</html>