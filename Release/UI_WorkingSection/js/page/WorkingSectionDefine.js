
var mOrganizationId = "";
var IsAdd = true;
var mWorkingSectionID = "";
var mProductionName = "";  //产线名称
var mSectionType = "";  //岗位类型
var mWorkingSection = ""; //岗位
var mEnabed = "";     //可用标志
var mEditor = "";  //编辑人
var mRemark = "";  //备注

$(document).ready(function () {
    LoadMainDataGrid("first");
    LoadSectionType();
});

function onOrganisationTreeClick(node) {
    $('#organizationName').textbox('setText', node.text);
    mOrganizationId = node.OrganizationId;
    LoadproductionName(mOrganizationId);
}
function LoadproductionName(mValue) {
    $.ajax({
        type: "POST",
        url: "WorkingSectionDefine.aspx/GetProductionNameList",
        data: " {mOrganizationID:'" + mValue + "'}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (msg) {
            var myData = jQuery.parseJSON(msg.d);
            $('#productionName').combotree({
                data: myData,
                valueField: 'OrganizationID',
                textField: 'Name',
                panelHeight: 'auto',
                onSelect: function (record) {
                    mProductionName = record.OrganizationID;
                }
            });
           // $('#productionName').combotree('collapseAll');
        },
        error: function () {
            $("#grid_Main").datagrid('loadData', []);
            $.messager.alert('失败', '加载失败！');
        }
    });

}
function LoadMainDataGrid(type, myData) {
    if (type == "first") {
        $('#grid_Main').datagrid({
            columns: [[
                    { field: 'OrganizationName', title: '所在产线', width: 100 },
                    {field: 'WorkingSectionName', title: '岗位名称', width: 80},
                    {
                        field: 'Type', title: '岗位类型', width: 60, formatter: function (value, row, index) {
                            if (value == "Clinker") { return value = "熟料"; }
                            else if (value == "CementMill") { return value = "水泥磨"; }
                            else if (value == "Cogeneration") { return value = "余热发电"; }
                        }
                    },                 
                    { field: 'Creator', title: '编辑人', width: 80},
                    { field: 'CreatedTime', title: '编辑时间', width: 120 },
                    {
                        field: 'Enabled', title: '启用标志', width: 80, align: "center", formatter: function (value, row, index) {
                            if (value == "True") { return value = "是"; } else { return value = "否"; }
                        }
                    },
                    { field: 'Remark', title: '备注', width: 80 },
                    {
                        field: 'edit', title: '编辑', width: 150, formatter: function (value, row, index) {
                            var str = "";
                            str = '<a href="#" onclick="editWorkingDefine(true,\'' + row.WorkingSectionID + '\')"><img class="iconImg" src = "/lib/extlib/themes/images/ext_icons/notes/note_edit.png" title="编辑页面" onclick="editWorkingDefine(true,\'' + row.WorkingSectionID + '\')"/>编辑</a>';
                            str = str + '<a href="#" onclick="deleteWorkingDefine(\'' + row.WorkingSectionID + '\')"><img class="iconImg" src = "/lib/extlib/themes/images/ext_icons/notes/note_delete.png" title="删除页面"  onclick="deleteWorkingDefine(\'' + row.WorkingSectionID + '\')"/>删除</a>';
                            //str = str + '<img class="iconImg" src = "/lib/extlib/themes/images/ext_icons/notes/note_delete.png" title="删除页面" onclick="DeletePageFun(\'' + row.id + '\');"/>删除';
                            return str;
                        }
                    }
            ]],
            fit: true,
            toolbar: "#toorBar",
            idField: 'WorkingSectionID',
            rownumbers: true,
            singleSelect: true,
            striped: true,
            data: []
        });
    }
    else {
        $('#grid_Main').datagrid('loadData', myData);
    }
}
function LoadSectionType() {
    $('#sectionType').combobox({
        valueField:'value',  
        textField: 'text',
        panelHeight:'auto',
        data: [
            { "value": "CementMill", "text": "水泥磨" },
            { "value": "Clinker", "text": "熟料" },
            { "value": "Cogeneration", "text": "余热发电" }] 
    });
}
function Query() {
    if (mOrganizationId == "" || mOrganizationId == undefined) {
        $.messager.alert('提示', '请选择组织机构！');
    }
    $.ajax({
        type: "POST",
        url: "WorkingSectionDefine.aspx/GetQueryData",
        data: " {mOrganizationId:'" + mOrganizationId  + "'}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (msg) {
            mger.window('close');
            var myData = jQuery.parseJSON(msg.d);
            if (myData.total == 0) {
                LoadMainDataGrid("last", []);
                $.messager.alert('提示', "没有查询的数据");
            } else {
                LoadMainDataGrid("last", myData);
            }
        },
        beforeSend: function (XMLHttpRequest) {
            //alert('远程调用开始...');
            mger = $.messager.alert('提示', "加载中...");
        },
        error: function () {
            $("#grid_Main").datagrid('loadData', []);
            $.messager.alert('失败', '获取数据失败');
        }
    });
}
function refresh() {
    Query();
}
function addFun() {
    editWorkingDefine(false);
}
function save() {
   
        //mProductionName = $('#productionName').combotree('getValue');
        mSectionType = $('#sectionType').combobox('getValue');
        mWorkingSection = $('#workingSection').textbox('getText');
        mEnabed = $('#Enabed').combobox('getValue');
        mEditor = $('#editor').textbox('getValue');
        mRemark = $('#remark').textbox('getValue');
        if (mProductionName == "" || mSectionType == "" || mWorkingSection == "")
            $.messager.alert('提示', '请填写未填项!');
        else {
            var mUrl = "";
            var mdata = "";
            if (IsAdd) {
                mUrl = "WorkingSectionDefine.aspx/AddWorkingSection";
                mdata =  "{mProductionName:'" + mProductionName + "',mSectionType:'" + mSectionType + "',mWorkingSection:'" + mWorkingSection + "',mEnabed:'" + mEnabed + "',mEditor:'" + mEditor + "',mRemark:'" + mRemark + "'}";
            } else if (IsAdd == false) {
                mUrl = "WorkingSectionDefine.aspx/EditWorkingSection";
                mdata = "{mWorkingSectionID:'" + mWorkingSectionID + "',mProductionName:'" + mProductionName + "',mSectionType:'" + mSectionType + "',mWorkingSection:'" + mWorkingSection + "',mEnabed:'" + mEnabed + "',mEditor:'" + mEditor + "',mRemark:'" + mRemark + "'}";
            }
            $.ajax({
                type: "POST",
                url: mUrl,
                data: mdata,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (msg) {
                    var myData = msg.d;
                    if (myData == 1) {
                        $.messager.alert('提示', '操作成功！');
                        $('#AddandEditor').window('close');
                        refresh();
                    }
                    else {
                        $.messager.alert('提示', '操作失败！');
                        refresh();
                    }
                },
                error: function () {
                    $.messager.alert('提示', '操作失败！');
                    $('#AddandEditor').window('close');
                    refresh();
                }
            });
        }
}
function editWorkingDefine(IsEdit, editContrastId) {
    if (IsEdit) {
        IsAdd = false;
        $('#grid_Main').datagrid('selectRecord', editContrastId);
        var data = $('#grid_Main').datagrid('getSelected');
        //mdata = "{mWorkingSectionID:'" + mWorkingSectionID +
        //    "',mProductionName:'" + mProductionName +
        //    "',mSectionType:'" + mSectionType +
        //    "',mWorkingSection:'" + mWorkingSection +
        //    "',mEnabed:'" + mEnabed +
        //    "',mEditor:'" + mEditor +
        //    "',mRemark:'" + mRemark + "'}";

        mWorkingSectionID = data.WorkingSectionID;
        $('#productionName').combotree('setText', data.OrganizationName);
        mProductionName = data.OrganizationID
        $('#sectionType').combobox('setValue', data.Type);
        mSectionType = data.Type;
        $('#workingSection').textbox('setText', data.WorkingSectionName);
        mWorkingSection = data.WorkingSectionName;
        $('#Enabed').combobox('setValue', data.Enabled);
        mEnabed=data.Enabled;
        $('#editor').textbox('setText', data.Creator);
        mEditor=data.Creator;
         $('#remark').textbox('setText', data.Remarks);
         mRemark = data.Remarks;
        
    }
    else {
        IsAdd = true;
        //"{mProductionName:'" + mProductionName +
        //"',mSectionType:'" + mSectionType +
        //"',mWorkingSection:'" + mWorkingSection +
        //"',mEnabed:'" + mEnabed +
        //"',mEditor:'" + mEditor +
        //"',mRemark:'" + mRemark + "'}";

        $('#productionName').combotree('setText', '');
        mProductionName = "";
        $('#sectionType').combobox('setText', '');
        mSectionType = "";
        $('#workingSection').textbox('setText', '');
        mWorkingSection = "";
        $('#Enabed').combobox('setValue', 'True');
        mEnabed = "True";
        $('#editor').textbox('setText', '');
        mEditor = "";
        $('#remark').textbox('setText', '');
        mRemark = "";

        if (mOrganizationId == "" && mOrganizationId == undefined) {
            $.messager.alert('提示', '请选择组织机构！');
        }
    }
    $('#AddandEditor').window('open');
}

function deleteWorkingDefine(deleteContrastId) {

    $('#grid_Main').datagrid('selectRecord', deleteContrastId);
    var data = $('#grid_Main').datagrid('getSelected');

    mWorkingSectionID = data.WorkingSectionID;

    $.ajax({
        type: "POST",
        url: "WorkingSectionDefine.aspx/deleteWorkingSection",
        data: "{mWorkingSectionID:'" + mWorkingSectionID + "'}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (msg) {
            var myData = msg.d;
            if (myData == 1) {
                $.messager.alert('提示', '删除成功！');
                $('#AddandEditor').window('close');
                refresh();
            }
            else {
                $.messager.alert('提示', '操作失败！');
                refresh();
            }
        },
        error: function () {
            $.messager.alert('提示', '操作失败！');
            $('#AddandEditor').window('close');
            refresh();
        }
    });
}