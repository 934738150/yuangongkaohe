<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="AssessmentVersionDefine.aspx.cs" Inherits="StaffAssessment.Web.UI_StaffAssessment.AssessmentVersionDefine" %>

<%@ Register Src="/UI_WebUserControls/OrganizationSelector/OrganisationTree.ascx" TagName="OrganisationTree" TagPrefix="uc1" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title></title>
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

    <script type="text/javascript" src="js/page/AssessmentVersionDefine.js" charset="utf-8"></script>
</head>
<body>
    <div id="cc" class="easyui-layout"data-options="fit:true,border:false" >    
         <div data-options="region:'west',split:true" style="width: 230px;">
            <uc1:OrganisationTree ID="OrganisationTree_ProductionLine" runat="server" />
        </div>
        <div data-options="region:'center',border:false" style="padding:5px;background:#eee;">
            <div class="easyui-layout"data-options="fit:true,border:false" >    
               <%--<div data-options="region:'north',border:false" style="height:42px;padding:5px;">--%>
                <div id="toorBar" title="" style="height:28px;padding:5px;">
                   <div>
                     <table>
                    <tr>
                          <td>组织机构:</td>
                        <td >                               
                            <input id="organizationName" class="easyui-textbox" readonly="readonly"style="width:120px" />               
                       </td>    
                         <td>岗位:</td>
                        <td >                               
                           <input class="easyui-combogrid" type="text" id="workingSection" style="width:85px" />                 
                        </td>  
                           <td>产线:</td> 
                        <td >                               
                            <input class="easyui-textbox" id="productionName" readonly="readonly"  style="width:120px"/>            
                        </td>                                  
                         <td>
                            <a id="btn" href="#" class="easyui-linkbutton" data-options="iconCls:'icon-search'" onclick="Query()">查询</a>
                        </td>
                          <td style="width:40px"></td>
                         <td>
                            <a href="javascript:void(0)" class="easyui-linkbutton" data-options="iconCls:'icon-add',plain:true" onclick="addFun()">添加考核版本</a>
                        </td>
                         <td>
                            <a href="javascript:void(0)" class="easyui-linkbutton" data-options="iconCls:'icon-reload',plain:true" onclick="refreshFun()">刷新</a>
                        </td>
                    </tr>
                </table>     
                   </div>    
	            </div> 
                <div id="toorBarDetail" title="" style="height:25px;padding:5px;">
                   <div>
                     <table>
                    <tr>
                        <td>考核名称:</td>
                        <td >                               
                            <input id="assessmentName" class="easyui-textbox" readonly="readonly"style="width:120px" />               
                       </td>    
                         <td>
                            <a href="javascript:void(0)" class="easyui-linkbutton" data-options="iconCls:'icon-add',plain:true" onclick="addDetailFun()">添加考核项</a>
                        </td>
                         <td>
                            <a href="javascript:void(0)" class="easyui-linkbutton" data-options="iconCls:'icon-reload',plain:true" onclick="refreshDetailFun()">刷新</a>
                        </td>
                    </tr>
                </table>     
                   </div>    
	            </div>
               <div data-options="region:'north',border:false" style="height:300px;background:#eee;">
                     <table id="grid_Main"class="easyui-datagrid"></table>
                 </div>
               <div data-options="region:'center',border:false,split:true" style="background:#eee;">
                   <table id="grid_MainDetail"class="easyui-datagrid"></table>
              </div>
           </div>
        </div>
    </div>	  
         <!-- 编辑窗口开始 -->
            <div id="AddandEditor" class="easyui-window" title="考核版本定义" data-options="modal:true,closed:true,iconCls:'icon-edit',minimizable:false,maximizable:false,collapsible:false,resizable:false" style="width:420px;height:auto;padding:10px 60px 20px 60px">
	    	    <table>
                     <tr>
	    			     <td>岗位名称：</td> 
	    			    <td>
                           <input class="easyui-combogrid" type="text" id="eWorkingSection" style="width:80px" />                  
                           <input class="easyui-textbox" id="eProductionName"readonly="readonly"  style="width:80px"/>           
	    			    </td>
	    		    </tr>
                    <tr>
	    			<td>考核名称：</td>
	    			<td>  <input id="eAssessmentName" class="easyui-textbox" type="text"  required="required" style="width:120px">
	    			</td>
	    		    </tr>
                    <tr>
	    			    <td>考核类型：</td> 
	    			    <td><input class="easyui-textbox" type="text" required="required" id="eAssessmentype" style="width:120px" />(*必填)</td>
	    		    </tr>
	    		    <tr>
                     <tr>
	    			    <td>编辑人：</td> 
	    			    <td><input class="easyui-textbox" type="text" id="editor" style="width:120px" /></td>
	    		    </tr>       
                     <tr>
	    			    <td>备注：</td> 
	    			    <td>
                          <input id="eRemark" class="easyui-textbox" data-options="multiline:true" style="width:160px;height:50px">
	    			    </td>
	    		    </tr>
	    	    </table>
	            <div style="text-align:center;padding:5px;margin-left:-18px;">
	    	        <a href="javascript:void(0)" class="easyui-linkbutton" data-options="iconCls:'icon-ok'" onclick="save()">保存</a>
	    	        <a href="javascript:void(0)" class="easyui-linkbutton" data-options="iconCls:'icon-cancel'" onclick="$('#AddandEditor').window('close');">取消</a>
	            </div>
            </div>
         <!-- 编辑窗口开始 -->
             <!-- 编辑窗口开始 -->
            <div id="AddandEditorDetail" class="easyui-window" title="考核项定义" data-options="modal:true,closed:true,iconCls:'icon-edit',minimizable:false,maximizable:false,collapsible:false,resizable:false" style="width:320px;height:auto;padding:10px 60px 20px 60px">
	    	    <table>
                     <tr>
	    			<td>考核项：</td> 
	    			<td>
                        <input class="easyui-combobox" type="text" id="eAssessmentObject" style="width:100px" />                  
                    </td>
	    		    </tr>
                    <tr>
	    			<td>考核元素：</td>
	    			<td> 
                         <input id="eAssessment" class="easyui-textbox" type="text"  required="required" style="width:100px">
	    			</td>
	    		    </tr>
	    		    <tr>
                     <tr>
	    			<td>权重：</td> 
	    			<td>
                     <input id="eWeightedValue" type="text" class="easyui-numberbox" required="required" style="width:60px">
	    			</td>
	    		    </tr>       
                     <tr>
	    			<td>最好值：</td> 
	    			<td>
                        <input id="eBestValue" type="text" class="easyui-numberbox" required="required" style="width:60px">
	    			</td>
	    		    </tr>
                    <tr>
	    			<td>最差值：</td> 
	    			<td>
                       <input id="eWorstValue" type="text" class="easyui-numberbox" required="required" style="width:60px">
	    			</td>
	    		    </tr>
                     <tr>   
                    <td>是否可用：</td> 
	    			<td>
                        <select id="eEnabled" class="easyui-combobox" data-options="panelHeight:'auto'" style="width:60px;">   
                             <option value="1">是</option> 
                             <option value="0">否</option>   
                        </select>
	    			</td>
	    		    </tr>
	    	    </table>
	            <div style="text-align:center;padding:5px;margin-left:-18px;">
	    	        <a href="javascript:void(0)" class="easyui-linkbutton" data-options="iconCls:'icon-ok'" onclick="saveDetail()">保存</a>
	    	        <a href="javascript:void(0)" class="easyui-linkbutton" data-options="iconCls:'icon-cancel'" onclick="$('#AddandEditorDetail').window('close');">取消</a>
	            </div>
            </div>
         <!-- 编辑窗口开始 -->
</body>
</html>
